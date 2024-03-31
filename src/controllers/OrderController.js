const Order = require("../models/OrderModel");
const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
	try {
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
		} = req.body;

		if (!orderItems || !shippingAddress || !paymentMethod) {
			return res.status(200).json({
				status: "ERROR",
				message: "Vui lòng nhập đầy đủ thông tin",
			});
		}
		const response = await OrderService.createOrder(req.body);
		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ message: error });
	}
};

module.exports = {
	createOrder,
};
