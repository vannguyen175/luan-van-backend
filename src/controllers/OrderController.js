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

//lấy thông tin các đơn hàng đã mua của Người dùng
const getUserOrder = async (req, res) => {
	try {
		const { stateOrder } = req.body;
		const idBuyer = req.params; //id_buyer
		if (!idBuyer) {
			return res.status(200).json({
				status: "ERROR",
				message: "Vui lòng nhập đầy đủ thông tin",
			});
		}
		const response = await OrderService.getUserOrder(stateOrder, idBuyer);
		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ message: error });
	}
};

//lấy thông tin các đơn hàng đã bán của Nhà bán hàng
const getSellerOrder = async (req, res) => {
	try {
		const { stateOrder } = req.body;
		const idSeller = req.params; //id_buyer
		if (!idSeller) {
			return res.status(200).json({
				status: "ERROR",
				message: "Vui lòng nhập đầy đủ thông tin",
			});
		}
		const response = await OrderService.getSellerOrder(stateOrder, idSeller);
		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ message: error });
	}
};
const updateOrder = async (req, res) => {
	try {
		const idOrder = req.params.id;
		const data = req.body; // Lấy dữ liệu từ body của yêu cầu

		const response = await OrderService.updateOrder(req.body, idOrder);
		return res.status(200).json(response);
	} catch (error) {
		console.log("error at controller: ", error);
		return res.status(404).json({ message: error });
	}
};
const analyticOrder = async (req, res) => {
	try {
		const { idUser } = req.body;
		const response = await OrderService.analyticOrder(idUser);
		return res.status(200).json(response);
	} catch (error) {
		console.log("error at controller: ", error);
		return res.status(404).json({ message: error });
	}
};
const ChartAnalyticOrder = async (req, res) => {
	try {
		const idUser = req.params.id;
		const response = await OrderService.ChartAnalyticOrder(idUser);
		return res.status(200).json(response);
	} catch (error) {
		console.log("error at controller: ", error);
		return res.status(404).json({ message: error });
	}
};

module.exports = {
	createOrder,
	getUserOrder,
	getSellerOrder,
	updateOrder,
	analyticOrder,
	ChartAnalyticOrder,
};
