const PaymentService = require("../services/PaymentService");

const createPayment = async (req, res) => {
	try {
		const response = await PaymentService.createPayment(req);
		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ message: error });
	}
};

module.exports = {
	createPayment,
};
