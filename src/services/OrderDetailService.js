const Product = require("../models/ProductModel");
const OrderDetail = require("../models/OrderDetail");

const createOrderDetail = (newOrder) => {
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

module.exports = {
	createOrderDetail,
};
