//POST: /api/order/create
const Product = require("../models/ProductModel");
const { Order, OrderStatus } = require("../models/OrderModel");
const User = require("../models/UserModel");
const { default: mongoose } = require("mongoose");

const cancelReason = {
	0: "Muốn thay đổi địa chỉ giao hàng",
	1: "Tìm thấy giá rẻ hơn ở chỗ khác",
	2: "Thủ tục thanh toán rắc rối",
	3: "Thay đổi ý",
	4: "Khác",
};

const createOrder = (newOrder) => {
	return new Promise(async (resolve, reject) => {
		const {
			product, //id_product
			shippingDetail,
			paymentMethod,
			buyer,
			seller,
		} = newOrder;
		try {
			await Product.findByIdAndUpdate(product, { statePost: "selled" });
			const createOrder = await Order.create({
				product: product,
				shippingDetail: {
					address: shippingDetail.address,
					email: shippingDetail.email,
					phone: shippingDetail.phone,
					shippingPrice: shippingDetail.shippingPrice,
					isPaid: paymentMethod === "autopay",
				},
				paymentMethod: paymentMethod,
				buyer: buyer,
				seller: seller,
			});
			return resolve({
				status: "SUCCESS",
				message: "Đặt hàng thành công!",
				data: createOrder,
			});
		} catch (error) {
			console.log(`Have error at createOrder service: ${error}`);
		}
	});
};

const getOrders = (seller, buyer, status, page, limit) => {
	return new Promise(async (resolve, reject) => {
		try {
			console.log("buyer", buyer);

			const perPage = limit; //Số items trên 1 page

			//kiểm tra + cập nhật trạng thái 5 phút của state "đang vận chuyển" và "đang giao hàng"
			const now = new Date();
			const fiveMinutesAgo = new Date(now - 5 * 60000);

			// Cập nhật trạng thái từ "Đang vận chuyển" sang "Giao hàng"
			await Order.updateMany(
				{ status: "Đang vận chuyển", updatedAt: { $lt: fiveMinutesAgo } },
				{ $set: { status: "Giao hàng", updatedAt: now } }
			);

			// Cập nhật trạng thái từ "Giao hàng" sang "Đã giao"
			await Order.updateMany({ status: "Giao hàng", updatedAt: { $lt: fiveMinutesAgo } }, { $set: { status: "Đã giao", updatedAt: now } });

			let statusOrder = null;
			if (status) {
				statusOrder = OrderStatus[status];
			}

			let orders = {};
			if (seller) {
				//lấy đơn hàng theo người bán
				orders = await Order.find({ seller: seller, status: statusOrder })
					.sort({ _id: 1 }) //Lấy order mới nhất
					.skip(perPage * (page - 1)) // Bỏ qua các bản ghi của các trang trước
					.limit(perPage)
					.populate({
						path: "product",
						select: "images name sellerName price",
						populate: {
							path: "subCategory",
							select: "name",
						},
					})
					.populate({
						path: "buyer",
						select: "avatar name",
					});
			} else {
				//lấy đơn hàng theo người mua
				orders = await Order.find({ buyer: buyer, status: statusOrder })
					.sort({ _id: 1 }) //Lấy order mới nhất
					.skip(perPage * (page - 1)) // Bỏ qua các bản ghi của các trang trước
					.limit(perPage)
					.populate({
						path: "product",
						select: "images name sellerName price",
						populate: {
							path: "subCategory",
							select: "name",
						},
					});
			}
			resolve({
				status: "SUCCESS",
				message: "Lấy đơn hàng thành công!",
				data: orders,
			});
		} catch (error) {
			reject(error);
			console.log(error);
		}
	});
};

const updateOrder = (idOrder, data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkOrder = await Order.findById({ _id: idOrder });
			if (checkOrder === null) {
				reject({
					status: "ERROR",
					message: "Có lỗi xảy ra.",
				});
			} else {
				if (data.stateOrder === "approved") {
					await Product.findByIdAndUpdate(checkOrder.orderItems.product, {
						selled: true,
					});
				} else if (data.stateOrder === "reject") {
					await Product.findByIdAndUpdate(checkOrder.orderItems.product, {
						selled: false,
					});
				}
				let status = checkOrder.status;
				if (data.status) {
					status = OrderStatus[data.status];
				}
				const updateOrder = await Order.findByIdAndUpdate(
					idOrder,
					{ ...data, status: status },
					{
						new: true,
					}
				);

				return resolve({
					status: "SUCCESS",
					message: "Cập nhật thành công",
					data: updateOrder,
				});
			}
		} catch (error) {
			console.log("error", error);
			reject(error);
		}
	});
};

const cancelOrder = (reason, idOrder) => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkOrder = await Order.findById({ _id: idOrder });
			if (checkOrder === null) {
				reject({
					status: "ERROR",
					message: "Đơn hàng không tồn tại",
				});
			} else {
				await Product.findByIdAndUpdate({ _id: checkOrder.product }, { statePost: "approved" });
				const updateOrder = await Order.findByIdAndUpdate(
					idOrder,
					{
						status: OrderStatus[4], //status: đã hủy
						cancelReason: cancelReason[reason],
					},
					{
						new: true,
					}
				);

				return resolve({
					status: "SUCCESS",
					message: "Hủy đơn hàng thành công",
					data: updateOrder,
				});
			}
		} catch (error) {
			console.log("error", error);
			reject(error);
		}
	});
};

const analyticOrder = (idUser) => {
	return new Promise(async (resolve, reject) => {
		try {
			console.log(idUser);
			if (idUser !== undefined) {
				//thống kê cho người dùng
				let priceBought = 0;
				const listProductBought = await Order.find({
					buyer: idUser,
					stateOrder: "approved",
				});
				if (listProductBought) {
					for (let index = 0; index < listProductBought.length; index++) {
						priceBought = priceBought + listProductBought[index].totalPrice;
					}
				}

				const listProductWaiting = await Order.find({
					buyer: idUser,
					stateOrder: "waiting",
				});

				let priceSelled = 0;
				const listProductSelled = await Order.find({
					seller: idUser,
					stateOrder: "approved",
				});
				if (listProductSelled) {
					for (let index = 0; index < listProductSelled.length; index++) {
						priceSelled = priceSelled + listProductSelled[index].totalPrice;
					}
				}
				const listOrderWaiting = await Order.find({
					seller: idUser,
					stateOrder: "waiting",
				});

				return resolve({
					status: "OK",
					message: "SUCCESS",
					listProductBought,
					priceBought,
					listProductSelled,
					priceSelled,
					listProductWaiting, //đơn hàng chờ seller duyệt của người mua
					listOrderWaiting,
				});
			} else {
				//thống kê cho quản trị viên
				let priceSelled = 0;
				const listOrderSelled = await Order.find({ stateOrder: "approved" });
				//const listProductSelling = await Product.find({ selled: { $ne: "true" } });
				const listProductSelling = await Product.find({
					statePost: "approved",
					selled: "false",
				});

				const listProductWaiting = await Product.find({
					statePost: "waiting",
				});

				if (listOrderSelled) {
					for (let index = 0; index < listOrderSelled.length; index++) {
						priceSelled = priceSelled + listOrderSelled[index].totalPrice;
					}
				}

				return resolve({
					status: "OK",
					message: "SUCCESS",
					listOrderSelled,
					listProductSelling,
					listProductWaiting,
					priceSelled,
				});
			}
		} catch (error) {
			console.log("error", error);
			reject(error);
		}
	});
};

const ChartAnalyticOrder = (idUser) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (idUser) {
				const ObjectId = mongoose.Types.ObjectId;
				// const result = await Order.aggregate([
				// 	{
				// 		$match: { buyer: new ObjectId(idUser) },
				// 	},
				// 	{
				// 		$group: {
				// 			_id: {
				// 				year: { $year: "$updatedAt" },
				// 				month: { $month: "$updatedAt" },
				// 			},
				// 			countOrders: { $sum: 1 },
				// 		},
				// 	},
				// ]);
				const result = await Order.aggregate([
					{
						$match: { buyer: new ObjectId(idUser) },
					},
				]);

				return resolve({
					status: "OK",
					message: "SUCCESS",
					result,
				});
			} else {
				//thống kê cho quản trị viên
				let priceBought = 0;
				const listProductBought = await Order.find();
				if (listProductBought) {
					for (let index = 0; index < listProductBought.length; index++) {
						priceBought = priceBought + listProductBought[index].totalPrice;
					}
				}

				let priceSelled = 0;
				const listProductSelled = await Order.find();
				if (listProductSelled) {
					for (let index = 0; index < listProductSelled.length; index++) {
						priceSelled = priceSelled + listProductSelled[index].totalPrice;
					}
				}

				return resolve({
					status: "OK",
					message: "SUCCESS",
					listProductBought,
					priceBought,
					listProductSelled,
					priceSelled,
				});
			}
		} catch (error) {
			console.log("error", error);
			reject(error);
		}
	});
};

module.exports = {
	createOrder,
	updateOrder,
	analyticOrder,
	ChartAnalyticOrder,
	getOrders,
	cancelOrder,
};
