const Order = require("../models/OrderModel");
const OrderDetailService = require("../services/OrderDetailService");

const createOrderDetail = async (req, res) => {
	try {
		const { shippingDetail, paymentMethod } = req.body;

		if (!shippingDetail || !paymentMethod) {
			return res.status(200).json({
				status: "ERROR",
				message: "Vui lòng nhập đầy đủ thông tin",
			});
		}
		const response = await OrderDetailService.createOrderDetail(req.body);
		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ message: error });
	}
};

module.exports = {
	createOrderDetail,
};
