//POST: /api/order/create
const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");
const User = require("../models/UserModel");
const { default: mongoose } = require("mongoose");

const createOrder = (newOrder) => {
	return new Promise(async (resolve, reject) => {
		const {
			orderItems,
			shippingAddress,
			phoneSeller,
			paymentMethod,
			itemPrice,
			shippingPrice,
			totalPrice,
			buyer,
			seller,
			isPaid,
			paidAt,
		} = newOrder;
		try {
			const productDetail = await Product.findById({ _id: orderItems.idProduct });
			const total_price = parseFloat(productDetail.price) + parseFloat(shippingPrice);
			const checkOrder = await Order.findOne({
				"orderItems.product": orderItems.idProduct,
			});

			if (checkOrder) {
				return resolve({
					status: "ERROR",
					message: "Sản phẩm đã được bán",
				});
			} else {
				await Product.findByIdAndUpdate(orderItems.idProduct, { selled: "waiting" });
				const createOrder = await Order.create({
					orderItems: {
						name: productDetail.name,
						image: productDetail.images[0].name,
						product: orderItems.idProduct,
					},
					shippingAddress: {
						address: shippingAddress.address,
						email: shippingAddress.email,
						phone: shippingAddress.phone,
					},
					paymentMethod,
					itemPrice: productDetail.price,
					shippingPrice,
					totalPrice: total_price,
					buyer,
					seller: productDetail.idUser,
					isPaid: false,
				});
				return resolve({
					status: "SUCCESS",
					message: "SUCCESS",
					data: createOrder,
				});
			}
		} catch (error) {
			console.log(`Have error at createOrder service: ${error}`);
		}
	});
};

const getUserOrder = (stateOrder, idBuyer) => {
	return new Promise(async (resolve, reject) => {
		const ObjectId = require("mongodb").ObjectId;
		try {
			if (stateOrder) {
				const result = await Order.find({
					buyer: new ObjectId(idBuyer),
					stateOrder: stateOrder,
				});
				return resolve({
					status: "OK",
					message: "SUCCESS",
					data: result,
				});
			} else {
				const result = await Order.find({ buyer: new ObjectId(idBuyer) });
				return resolve({
					status: "OK",
					message: "SUCCESS",
					data: result,
				});
			}
		} catch (error) {
			console.log("error", error);
			// 			reject(error);
		}
	});
};

const getSellerOrder = (stateOrder, isSeller) => {
	return new Promise(async (resolve, reject) => {
		const ObjectId = require("mongodb").ObjectId;
		try {
			let data;
			if (stateOrder != "all") {
				data = await Order.find({
					seller: new ObjectId(isSeller),
					stateOrder: stateOrder,
				});
			} else {
				data = await Order.find({ seller: new ObjectId(isSeller) });
			}
			let result = [];
			if (data !== null) {
				for (let i = 0; i < data.length; i++) {
					let buyerInfo = await User.findById(data[i].buyer);
					data[i].buyerName = buyerInfo.name;
					result[i] = { ...data[i] };
				}
				return resolve({
					status: "OK",
					message: "SUCCESS",
					data: result,
				});
			}
		} catch (error) {
			console.log("error", error);
			reject(error);
		}
	});
};

const updateOrder = (data, idOrder) => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkOrder = await Order.findById({ _id: idOrder });
			if (checkOrder === null) {
				reject({
					status: "ERROR",
					message: "Order is not exists",
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
				const updateOrder = await Order.findByIdAndUpdate(idOrder, data, {
					new: true,
				});

				return resolve({
					status: "OK",
					message: "SUCCESS",
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
	getUserOrder,
	getSellerOrder,
	updateOrder,
	analyticOrder,
	ChartAnalyticOrder,
};
