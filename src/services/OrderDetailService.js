const Product = require("../models/ProductModel");
const OrderDetail = require("../models/OrderDetailModel");

const createOrderDetail = (detailOrder, idOrder) => {
	return new Promise(async (resolve, reject) => {
		try {
			for (let index = 0; index < detailOrder.length; index++) {
				const createDetailOrder = await OrderDetail.create({
					idOrder: idOrder,
					idProduct: detailOrder[index].idProduct,
					idSeller: detailOrder[index].idSeller,
					quantity: detailOrder[index].quantity,
					productPrice: detailOrder[index].productPrice,
					shippingPrice: detailOrder[index].shippingPrice,
					isPaid: detailOrder[index].isPaid,
					note: detailOrder[index]?.note,
				});
				if (createDetailOrder) {
					await Product.findByIdAndUpdate(detailOrder[index].idProduct, { statePost: "selled" });
				}
			}
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

module.exports = {
	createOrderDetail,
};
