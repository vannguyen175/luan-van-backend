const Product = require("../models/ProductModel");
const { Order } = require("../models/OrderModel");
const User = require("../models/UserModel");
const OrderDetailService = require("../services/OrderDetailService");
const { OrderDetail, OrderStatus } = require("../models/OrderDetailModel");
const Category = require("../models/CategoryModel");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const formatDate = (isoString) => {
	const date = new Date(isoString);
	const month = date.getUTCMonth() + 1;
	const year = date.getUTCFullYear();
	return `${month}/${year}`;
};

//thống kê SP theo người bán
const analyticProduct = (idUser, typeDate, startDay) => {
	return new Promise(async (resolve, reject) => {
		try {
			const current = new Date();
			let onSell = {};
			let selled = {};
			let totalPosted = null;
			let totalSelled = null;
			let totalRejected = null;
			let allProducts = {};

			totalPosted = await Product.find({ idUser: idUser, statePost: { $in: ["approved", "selled"] } });
			totalSelled = await OrderDetail.find({ idSeller: idUser });
			totalRejected = await Product.find({ idUser: idUser, statePost: { $in: ["rejected"] } });
			if (typeDate === "week") {
				//hiển thị sản phẩm theo các ngày trong 1 tuần
				const startOfWeek = new Date(startDay);
				const endDay = new Date(startOfWeek);
				endDay.setDate(startOfWeek.getDate() + 6);
				const endOfWeek = new Date(endDay.setHours(23, 59, 59, 999));

				//sản phẩm đang bán
				allProducts = await Product.find({ idUser: idUser, createdAt: { $gte: startOfWeek, $lt: endOfWeek } });
				for (let date = new Date(startOfWeek); date < new Date(endOfWeek); date.setDate(date.getDate() + 1)) {
					totalRevenue = allProducts.filter((item) => {
						const postProductDate = new Date(item.createdAt);
						return postProductDate.toDateString() === date.toDateString();
					});
					onSell[date.toDateString()] = totalRevenue.length;
				}
				//sản phẩm đã bán
				allProducts = await Product.find({ idUser: idUser, updatedAt: { $gte: startOfWeek, $lt: endOfWeek } });
				for (let date = new Date(startOfWeek); date < new Date(endOfWeek); date.setDate(date.getDate() + 1)) {
					totalRevenue = allProducts.filter((item) => {
						const postProductDate = new Date(item.updatedAt);
						return postProductDate.toDateString() === date.toDateString() && item.statePost === "selled";
					});
					selled[date.toDateString()] = totalRevenue.length;
				}
			} else if (typeDate === "month") {
				//hiển thị sản phẩm theo 12 tháng gần nhất
				const currentMonth = current.getMonth();
				const currentYear = current.getFullYear();

				const months = [];

				for (let i = 0; i < 12; i++) {
					const month = (currentMonth - i + 12) % 12;
					const year = currentYear - Math.floor((i + 12 - currentMonth) / 12);
					const monthString = `${month + 1}/${year}`;
					months.push(monthString);
				}
				//sản phẩm đang bán
				let allProducts = await Product.find({ idUser: idUser });
				months.reverse().forEach((month) => {
					const ProductsInMonth = allProducts.filter((item) => {
						const orderMonth = new Date(item.createdAt);
						return formatDate(orderMonth) === month;
					});
					onSell[month] = ProductsInMonth.length;
				});
				//sản phẩm đã bán
				months.forEach((month) => {
					const ProductsInMonth = allProducts.filter((item) => {
						const orderMonth = new Date(item.updatedAt);
						return formatDate(orderMonth) === month && item.statePost === "selled";
					});
					selled[month] = ProductsInMonth.length;
				});
			}

			{
				return resolve({
					status: "SUCCESS",
					message: "Thống kê sản phẩm thành công!",
					onSell: onSell,
					selled: selled,
					totalPosted: totalPosted.length,
					totalSelled: totalSelled.length,
					totalRejected: totalRejected.length,
				});
			}
		} catch (error) {
			console.log(`Have error at analyticProduct service: ${error}`);
		}
	});
};
//thống kê đơn hàng theo người bán
const analyticOrder = (idSeller, typeDate, startDay) => {
	return new Promise(async (resolve, reject) => {
		try {
			let stateOrders = {
				waiting: null,
				approved: null,
				rejected: null,
			};
			let totalRevenue = {};
			let totalRevenueChart = {};
			//typeUser == "seller" && typeDate == "today" => Nhà bán hàng
			const waitingOrders = await OrderDetail.find({ idSeller: idSeller, status: OrderStatus[0] }).select("_id");
			const approvedOrders = await OrderDetail.find({
				idSeller: idSeller,
				status: { $nin: [OrderStatus[0], OrderStatus[4]] },
			}).select("_id");

			const rejectedOrders = await OrderDetail.find({ idSeller: idSeller, status: OrderStatus[4] }).select("_id");
			stateOrders = {
				waiting: waitingOrders.length,
				approved: approvedOrders.length,
				rejected: rejectedOrders.length,
			};
			totalRevenue = await OrderDetail.aggregate([
				{ $match: { idSeller: new ObjectId(idSeller), status: OrderStatus[3] } },
				{
					$group: {
						_id: null,
						totalRevenue: { $sum: "$productPrice" },
					},
				},
			]);
			if (typeDate === "week") {
				//hiển thị đơn hàng theo các ngày trong 1 tuần

				const startOfWeek = new Date(startDay);
				const endDay = new Date(startOfWeek);
				endDay.setDate(startOfWeek.getDate() + 6);
				const endOfWeek = new Date(endDay.setHours(23, 59, 59, 999));

				//doanh thu đơn hàng
				allOrders = await OrderDetail.find({
					idSeller: idSeller,
					updatedAt: { $gte: startOfWeek, $lt: endOfWeek },
					status: OrderStatus[3],
				}).select("createdAt");
				for (let date = new Date(startOfWeek); date < new Date(endOfWeek); date.setDate(date.getDate() + 1)) {
					const res = allOrders.filter((item) => {
						const orderCheck = new Date(item.createdAt);
						return orderCheck.toDateString() === date.toDateString();
					});
					const totalRevenueForDay = res.reduce((total, item) => total + item.productPrice, 0);
					totalRevenueChart[date.toDateString()] = totalRevenueForDay;
				}
			} else if (typeDate === "month") {
				//hiển thị sản phẩm theo 12 tháng gần nhất
				const current = new Date();
				const currentMonth = current.getMonth();
				const currentYear = current.getFullYear();
				const months = [];
				for (let i = 0; i < 12; i++) {
					const month = (currentMonth - i + 12) % 12;
					const year = currentYear - Math.floor((i + 12 - currentMonth) / 12);
					const monthString = `${month + 1}/${year}`;
					months.push(monthString);
				}
				//doanh thu đơn hàng
				allOrders = await OrderDetail.find({ idSeller: idSeller }).select("createdAt productPrice");
				months.reverse().forEach((month) => {
					const res = allOrders.filter((item) => {
						const orderMonth = new Date(item.createdAt);
						return formatDate(orderMonth) === month;
					});
					const RevenueInMonth = res.reduce((total, item) => total + item.productPrice, 0);
					totalRevenueChart[month] = RevenueInMonth;
				});
			}

			{
				return resolve({
					status: "SUCCESS",
					message: "Thống kê đơn hàng thành công!",
					stateOrders: stateOrders,
					totalRevenue: totalRevenue,
					totalRevenueChart: totalRevenueChart || [],
				});
			}
		} catch (error) {
			console.log(`Have error at analyticOrder service: ${error}`);
		}
	});
};
//thống kê SP cho admin
const analyticProductAdmin = (typeDate, startDay) => {
	return new Promise(async (resolve, reject) => {
		try {
			const current = new Date();
			let onSell = {};
			let selled = {};
			let totalPosted = null;
			let totalSelled = null;
			let totalRejected = null;
			let allProducts = {};

			totalPosted = await Product.find({ statePost: { $in: ["approved", "selled"] } }).select("_id");
			totalSelled = await Product.find({ statePost: { $in: ["selled"] } }).select("_id");
			totalRejected = await Product.find({ statePost: { $in: ["rejected"] } }).select("_id");
			if (typeDate === "week") {
				//hiển thị sản phẩm theo các ngày trong 1 tuần
				const startOfWeek = new Date(startDay);
				const endDay = new Date(startOfWeek);
				endDay.setDate(startOfWeek.getDate() + 6);
				const endOfWeek = new Date(endDay.setHours(23, 59, 59, 999));

				//sản phẩm đang bán
				allProducts = await Product.find({ createdAt: { $gte: startOfWeek, $lt: endOfWeek } }).select("createdAt");
				for (let date = new Date(startOfWeek); date < new Date(endOfWeek); date.setDate(date.getDate() + 1)) {
					totalRevenue = allProducts.filter((item) => {
						const postProductDate = new Date(item.createdAt);
						return postProductDate.toDateString() === date.toDateString();
					});
					onSell[date.toDateString()] = totalRevenue.length;
				}
				//sản phẩm đã bán
				allProducts = await Product.find({ updatedAt: { $gte: startOfWeek, $lt: endOfWeek } }).select("createdAt");
				for (let date = new Date(startOfWeek); date < new Date(endOfWeek); date.setDate(date.getDate() + 1)) {
					totalRevenue = allProducts.filter((item) => {
						const postProductDate = new Date(item.updatedAt);
						return postProductDate.toDateString() === date.toDateString() && item.statePost === "selled";
					});
					selled[date.toDateString()] = totalRevenue.length;
				}
			} else if (typeDate === "month") {
				//hiển thị sản phẩm theo 12 tháng gần nhất
				const currentMonth = current.getMonth();
				const currentYear = current.getFullYear();

				const months = [];

				for (let i = 0; i < 12; i++) {
					const month = (currentMonth - i + 12) % 12;
					const year = currentYear - Math.floor((i + 12 - currentMonth) / 12);
					const monthString = `${month + 1}/${year}`;
					months.push(monthString);
				}
				//sản phẩm đang bán
				let allProducts = await Product.find({}).select("createdAt");
				months.reverse().forEach((month) => {
					const ProductsInMonth = allProducts.filter((item) => {
						const orderMonth = new Date(item.createdAt);
						return formatDate(orderMonth) === month;
					});
					onSell[month] = ProductsInMonth.length;
				});
				//sản phẩm đã bán
				months.forEach((month) => {
					const ProductsInMonth = allProducts.filter((item) => {
						const orderMonth = new Date(item.updatedAt);
						return formatDate(orderMonth) === month && item.statePost === "selled";
					});
					selled[month] = ProductsInMonth.length;
				});
			}

			{
				return resolve({
					status: "SUCCESS",
					message: "Thống kê sản phẩm thành công!",
					onSell: onSell,
					selled: selled,
					totalPosted: totalPosted.length,
					totalSelled: totalSelled.length,
					totalRejected: totalRejected.length,
				});
			}
		} catch (error) {
			console.log(`Have error at analyticProduct service: ${error}`);
		}
	});
};
//thống kê đơn hàng cho admin
const analyticOrderAdmin = (typeDate, startDay) => {
	return new Promise(async (resolve, reject) => {
		try {
			let stateOrders = {
				waiting: null,
				approved: null,
				rejected: null,
			};
			let totalRevenue = {};
			let totalRevenueChart = {};
			//typeUser == "seller" && typeDate == "today" => Nhà bán hàng
			const waitingOrders = await OrderDetail.find({ status: OrderStatus[0] }).select("_id");
			const approvedOrders = await OrderDetail.find({
				status: { $nin: [OrderStatus[0], OrderStatus[4]] },
			}).select("_id");
			const rejectedOrders = await OrderDetail.find({ status: OrderStatus[4] }).select("_id");

			stateOrders = {
				waiting: waitingOrders.length,
				approved: approvedOrders.length,
				rejected: rejectedOrders.length,
			};
			totalRevenue = await OrderDetail.aggregate([
				{ $match: { status: OrderStatus[3] } },
				{
					$group: {
						_id: null,
						totalRevenue: { $sum: "$productPrice" },
					},
				},
			]);
			if (typeDate === "week") {
				//hiển thị đơn hàng theo các ngày trong 1 tuần

				const startOfWeek = new Date(startDay);
				const endDay = new Date(startOfWeek);
				endDay.setDate(startOfWeek.getDate() + 6);
				const endOfWeek = new Date(endDay.setHours(23, 59, 59, 999));

				//doanh thu đơn hàng
				allOrders = await OrderDetail.find({ createdAt: { $gte: startOfWeek, $lt: endOfWeek }, status: OrderStatus[3] }).select(
					"productPrice createdAt status"
				);
				for (let date = new Date(startOfWeek); date < new Date(endOfWeek); date.setDate(date.getDate() + 1)) {
					const res = allOrders.filter((item) => {
						const orderCheck = new Date(item.createdAt);
						return orderCheck.toDateString() === date.toDateString();
					});
					const totalRevenueForDay = res.reduce((total, item) => total + item.productPrice, 0);
					totalRevenueChart[date.toDateString()] = totalRevenueForDay;
				}
			} else if (typeDate === "month") {
				//hiển thị sản phẩm theo 12 tháng gần nhất
				const current = new Date();
				const currentMonth = current.getMonth();
				const currentYear = current.getFullYear();
				const months = [];
				for (let i = 0; i < 12; i++) {
					const month = (currentMonth - i + 12) % 12;
					const year = currentYear - Math.floor((i + 12 - currentMonth) / 12);
					const monthString = `${month + 1}/${year}`;
					months.push(monthString);
				}
				//doanh thu đơn hàng
				allOrders = await OrderDetail.find({ status: OrderStatus[3] }).select("productPrice createdAt");
				months.reverse().forEach((month) => {
					const res = allOrders.filter((item) => {
						const orderMonth = new Date(item.createdAt);
						return formatDate(orderMonth) === month;
					});
					const RevenueInMonth = res.reduce((total, item) => total + item.productPrice, 0);
					totalRevenueChart[month] = RevenueInMonth;
				});
			}

			{
				return resolve({
					status: "SUCCESS",
					message: "Thống kê đơn hàng thành công!",
					stateOrders: stateOrders,
					totalRevenue: totalRevenue,
					totalRevenueChart: totalRevenueChart || [],
				});
			}
		} catch (error) {
			console.log(`Have error at analyticOrderAdmin service: ${error}`);
		}
	});
};
//thống kê danh mục cho admin
const analyticCategoryAdmin = () => {
	return new Promise(async (resolve, reject) => {
		try {
			let dataChart = {};
			let dataChartDetail = {};

			const allProducts = await Product.find()
				.select("name")
				.populate({
					path: "subCategory",
					select: "name category",
					populate: {
						path: "category",
						select: "name",
					},
				});
			// allProducts.forEach((product) => {
			// 	const categoryName = product.subCategory?.category?.name;
			// 	if (categoryName) {
			// 		dataChart[categoryName] = (dataChart[categoryName] || 0) + 1;
			// 	}
			// });
			allProducts.forEach((product) => {
				const categoryName = product.subCategory?.category?.name;
				const subCateName = product.subCategory?.name;
				if (categoryName && subCateName) {
					if (!dataChartDetail[categoryName]) {
						dataChartDetail[categoryName] = {};
					}
					dataChart[categoryName] = (dataChart[categoryName] || 0) + 1;
					dataChartDetail[categoryName][subCateName] = (dataChartDetail[categoryName][subCateName] || 0) + 1;
				}
			});
			{
				return resolve({
					status: "SUCCESS",
					message: "Thống kê danh mục thành công!",
					data: dataChart,
					dataDetail: dataChartDetail,
				});
			}
		} catch (error) {
			console.log(`Have error at analyticCategoryAdmin service: ${error}`);
		}
	});
};

//thống kê SP cho người mua
const analyticProductBuyer = (idUser, typeDate, startDay) => {
	return new Promise(async (resolve, reject) => {
		try {
			let totalPaid = {};
			let totalBrought = {};

			//số lượng SP đã mua
			const productBrought = await OrderDetail.find({
				status: OrderStatus[3],
			}).populate({
				path: "idOrder",
				match: { idBuyer: idUser },
			});

			const productBroughtCount = productBrought.filter((order) => order.idOrder !== null).length;

			//.countDocuments(); // Đếm số tài liệu sau khi đã tìm và populate

			//số lượng SP đang chờ xử lý
			const productWaiting = await OrderDetail.find({
				status: { $nin: [OrderStatus[3], OrderStatus[4]] },
			}).populate({
				path: "idOrder",
				match: { idBuyer: idUser },
			});
			const productWaitingCount = productWaiting.filter((order) => order.idOrder !== null).length;

			//số lượng SP đã hủy
			const productCancel = await OrderDetail.find({
				status: OrderStatus[4],
			}).populate({
				path: "idOrder",
				match: { idBuyer: idUser },
			});
			const productCancelCount = productCancel.filter((order) => order.idOrder !== null).length;

			//tổng tiền đã chi khi mua SP
			totalPaid = await Order.aggregate([
				{ $match: { idBuyer: new ObjectId(idUser) } },
				{
					$group: {
						_id: null,
						totalPaid: { $sum: "$totalPaid" },
					},
				},
			]);

			if (typeDate === "week") {
				//hiển thị sản phẩm theo các ngày trong 1 tuần
				const startOfWeek = new Date(startDay);
				const endDay = new Date(startOfWeek);
				endDay.setDate(startOfWeek.getDate() + 6);
				const endOfWeek = new Date(endDay.setHours(23, 59, 59, 999));

				//sản phẩm đã mua
				allProducts = await OrderDetail.find({
					createdAt: { $gte: startOfWeek, $lt: endOfWeek },
					status: OrderStatus[3],
				}).populate({
					path: "idOrder",
					match: { idBuyer: idUser },
				});

				for (let date = new Date(startOfWeek); date < new Date(endOfWeek); date.setDate(date.getDate() + 1)) {
					totalProduct = allProducts.filter((item) => {
						const productBrougthDate = new Date(item.createdAt);
						return productBrougthDate.toDateString() === date.toDateString();
					});
					totalBrought[date.toDateString()] = totalProduct.length;
				}
			} else if (typeDate === "month") {
				//hiển thị sản phẩm theo 12 tháng gần nhất
				const current = new Date();
				const currentMonth = current.getMonth();
				const currentYear = current.getFullYear();

				const months = [];

				for (let i = 0; i < 12; i++) {
					const month = (currentMonth - i + 12) % 12;
					const year = currentYear - Math.floor((i + 12 - currentMonth) / 12);
					const monthString = `${month + 1}/${year}`;
					months.push(monthString);
				}
				//sản phẩm đã mua
				const data = await OrderDetail.find({
					status: OrderStatus[3],
				}).populate({
					path: "idOrder",
					match: { idBuyer: idUser },
				});

				let allProducts = data.filter((order) => order.idOrder !== null);

				months.reverse().forEach((month) => {
					const ProductsInMonth = allProducts.filter((item) => {
						const orderMonth = new Date(item.idOrder.createdAt);
						return formatDate(orderMonth) === month;
					});
					totalBrought[month] = ProductsInMonth.length;
				});
			}

			{
				return resolve({
					status: "SUCCESS",
					message: "Thống kê sản phẩm đã mua thành công!",
					stateOrders: {
						brought: productBroughtCount,
						waiting: productWaitingCount,
						cancel: productCancelCount,
					},
					totalPaid: totalPaid[0].totalPaid,
					totalBrought: totalBrought || [],
				});
			}
		} catch (error) {
			console.log(`Have error at analyticOrder service: ${error}`);
		}
	});
};

//thống kê tổng chi của người mua
const analyticTotalPaid = (idBuyer, typeDate, startDay) => {
	return new Promise(async (resolve, reject) => {
		try {
			let totalPaidChart = {};
			if (typeDate === "week") {
				const startOfWeek = new Date(startDay);
				const endDay = new Date(startOfWeek);
				endDay.setDate(startOfWeek.getDate() + 6);
				const endOfWeek = new Date(endDay.setHours(23, 59, 59, 999));

				//doanh thu đơn hàng
				allOrders = await Order.find({
					idBuyer: idBuyer,
					updatedAt: { $gte: startOfWeek, $lt: endOfWeek },
				}).select("createdAt totalPaid");

				for (let date = new Date(startOfWeek); date < new Date(endOfWeek); date.setDate(date.getDate() + 1)) {
					const res = allOrders.filter((item) => {
						const orderCheck = new Date(item.createdAt);
						return orderCheck.toDateString() === date.toDateString();
					});
					const totalRevenueForDay = res.reduce((total, item) => total + item.totalPaid, 0);
					totalPaidChart[date.toDateString()] = totalRevenueForDay;
				}
			} else if (typeDate === "month") {
				//hiển thị sản phẩm theo 12 tháng gần nhất
				const current = new Date();
				const currentMonth = current.getMonth();
				const currentYear = current.getFullYear();
				const months = [];
				for (let i = 0; i < 12; i++) {
					const month = (currentMonth - i + 12) % 12;
					const year = currentYear - Math.floor((i + 12 - currentMonth) / 12);
					const monthString = `${month + 1}/${year}`;
					months.push(monthString);
				}
				//doanh thu đơn hàng
				allOrders = await Order.find({ idBuyer: idBuyer }).select("createdAt totalPaid");
				months.reverse().forEach((month) => {
					const res = allOrders.filter((item) => {
						const orderMonth = new Date(item.createdAt);
						return formatDate(orderMonth) === month;
					});
					const RevenueInMonth = res.reduce((total, item) => total + item.totalPaid, 0);
					totalPaidChart[month] = RevenueInMonth;
				});
			}

			{
				return resolve({
					status: "SUCCESS",
					message: "Thống kê tổng chi tiêu thành công!",
					totalPaidChart: totalPaidChart || [],
				});
			}
		} catch (error) {
			console.log(`Have error at analyticOrder service: ${error}`);
		}
	});
};

module.exports = {
	analyticProduct,
	analyticOrder,
	analyticProductAdmin,
	analyticOrderAdmin,
	analyticCategoryAdmin,
	analyticProductBuyer,
	analyticTotalPaid,
};
