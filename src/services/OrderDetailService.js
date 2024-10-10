const Product = require("../models/ProductModel");
const { OrderDetail, OrderStatus } = require("../models/OrderDetailModel");
const { Order } = require("../models/OrderModel");
const User = require("../models/UserModel");
const Seller = require("../models/SellerModel");
const NotificationService = require("../services/NotificationService");

const CartService = require("../services/CartService");

let io; //biến io đã khởi tạo ở socket.js
let getUserSocketId; //hàm lấy socket userID

const socket = (socketIO, getUserSocketIdFn) => {
	io = socketIO;
	getUserSocketId = getUserSocketIdFn;
};

const createOrderDetail = (products, idOrder, paymentMethod, idBuyer) => {
	return new Promise(async (resolve, reject) => {
		try {
			for (let index = 0; index < products.length; index++) {
				const createDetailOrder = await OrderDetail.create({
					idOrder: idOrder,
					idProduct: products[index].idProduct,
					idSeller: products[index].idSeller,
					quantity: products[index].quantity,
					productPrice: products[index].price,
					shippingPrice: products[index].shippingPrice,
					isPaid: paymentMethod === "vnpay",
					note: products[index]?.note,
				});
				//cập nhật số lượng sản phẩm + trạng thái của sản phẩm
				if (createDetailOrder) {
					const productStored = await Product.findOne({ _id: products[index].idProduct });
					if (productStored.quantity >= products[index].quantity) {
						await Product.findByIdAndUpdate(
							products[index].idProduct,
							{
								$inc: { quantity: -products[index].quantity }, // Trừ dần số lượng từ quantity
							},
							{ new: true }
						);
					} else {
						console.log("Không đủ số lượng sản phẩm trong kho.");
					}
					if (productStored.quantity == products[index].quantity) {
						await Product.findByIdAndUpdate(products[index].idProduct, { statePost: "selled" }, { new: true });
					}
				}

				//xóa sản phẩm trong giỏ hàng
				await CartService.deleteCart(idBuyer, products[index].idProduct);
			}
			return resolve({
				status: "success",
				message: "Đặt hàng thành công!",
			});
		} catch (error) {
			console.log(`Have error at createDetailOrder service: ${error}`);
		}
	});
};

const getOrdersDetail = (seller, buyer, status, page, limit) => {
	return new Promise(async (resolve, reject) => {
		try {
			const perPage = limit; //Số items trên 1 page

			//kiểm tra + cập nhật trạng thái 5 phút của state "đang vận chuyển" và "đang giao hàng"
			const now = new Date();
			const fiveMinutesAgo = new Date(now - 5 * 60000);

			// Cập nhật trạng thái từ "Đang vận chuyển" sang "Giao hàng"
			await OrderDetail.updateMany(
				{ status: "Đang vận chuyển", updatedAt: { $lt: fiveMinutesAgo } },
				{ $set: { status: "Giao hàng", updatedAt: now } }
			);

			// Cập nhật trạng thái từ "Giao hàng" sang "Đã giao"
			await OrderDetail.updateMany(
				{ status: "Giao hàng", updatedAt: { $lt: fiveMinutesAgo } },
				{ $set: { status: "Đã giao", updatedAt: now } }
			);

			let statusOrder = null;
			if (status !== null) {
				statusOrder = OrderStatus[status];
			}

			let orders = {};
			if (seller) {
				//lấy đơn hàng theo người bán
				orders = await OrderDetail.find({ idSeller: seller, status: statusOrder })
					.sort({ _id: 1 }) //Lấy order mới nhất
					.skip(perPage * (page - 1)) // Bỏ qua các bản ghi của các trang trước
					.limit(perPage)
					.populate({
						path: "idProduct",
						select: "images name sellerName price",
						populate: {
							path: "subCategory",
							select: "name",
						},
					})
					.populate({
						path: "idOrder",
						select: "shippingDetail idBuyer paymentMethod",
						populate: {
							path: "idBuyer",
							select: "name",
						},
					});
			} else {
				//lấy đơn hàng theo người mua
				const getOrdersBuyer = await Order.find({ idBuyer: buyer });
				const orderIds = getOrdersBuyer.map((order) => order._id); // Lấy danh sách idOrder

				orders = await OrderDetail.find({ idOrder: { $in: orderIds }, status: statusOrder })
					.sort({ _id: 1 }) //Lấy order mới nhất
					.skip(perPage * (page - 1)) // Bỏ qua các bản ghi của các trang trước
					.limit(perPage)
					.populate({
						path: "idProduct",
						select: "images name sellerName",
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

const updateOrderDetail = (idOrder, data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkOrder = await OrderDetail.findById({ _id: idOrder })
				.populate({
					path: "idProduct",
					select: "images name",
				})
				.populate({
					path: "idOrder",
					select: "idBuyer",
				});
			if (checkOrder === null) {
				reject({
					status: "ERROR",
					message: "Có lỗi xảy ra.",
				});
			} else {
				//đơn hàng đã được người bán chấp nhận => bán thành công
				if (data.status === "1") {
					// const updateProduct = await Product.findByIdAndUpdate(checkOrder.product, {
					// 	selled: true,
					// });
					//imageProduct = updateProduct.images[0];
					await Seller.findOneAndUpdate({ idUser: checkOrder.idOrder.idBuyer }, { $inc: { totalSold: 1 } }); //tăng totalSelled thêm 1
				} else if (data.status === "4") {
					//đơn hàng bị hủy
					await Product.findByIdAndUpdate(
						checkOrder.idProduct,
						{
							$inc: { quantity: +checkOrder.quantity }, // Trừ dần số lượng từ quantity
						},
						{ new: true }
					);
				}
				let status = checkOrder.status;
				if (data.status) {
					status = OrderStatus[data.status];
				}
				const updateOrder = await OrderDetail.findByIdAndUpdate(
					idOrder,
					{ ...data, status: status },
					{
						new: true,
					}
				);
				const userSocket = getUserSocketId(checkOrder.idOrder.idBuyer);
				const addNoti = await NotificationService.addNotification({
					user: checkOrder.idOrder.idBuyer,
					info: {
						product: checkOrder.idProduct,
						image: checkOrder.idProduct.images[0],
						navigate: "order",
						message: "Đơn hàng của bạn đã được người bán phê duyệt và sớm được giao đến bạn.",
					},
				});
				if (userSocket) {
					io.to(userSocket.socketId).emit("getNotification", {
						unseenCount: addNoti.unseenCount,
					});
				}

				return resolve({
					status: "SUCCESS",
					message: "Cập nhật đơn hàng thành công",
					//data: updateOrder,
				});
			}
		} catch (error) {
			console.log("error", error);
			reject(error);
		}
	});
};

module.exports = {
	socket,
	createOrderDetail,
	getOrdersDetail,
	updateOrderDetail,
};
