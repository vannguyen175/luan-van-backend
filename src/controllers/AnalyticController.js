const AnalyticService = require("../services/AnalyticService");

const analyticProduct = async (req, res) => {
	try {
		const { idUser, typeDate, startDay } = req.body;

		if (!idUser || !typeDate) {
			return res.status(200).json({
				status: "ERROR",
				message: "Vui lòng nhập đầy đủ thông tin",
			});
		}
		const response = await AnalyticService.analyticProduct(idUser, typeDate, startDay);
		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ message: error });
	}
};
const analyticOrder = async (req, res) => {
	try {
		const { idSeller, typeDate, startDay } = req.body;

		if (!idSeller || !typeDate) {
			return res.status(200).json({
				status: "ERROR",
				message: "Vui lòng nhập đầy đủ thông tin",
			});
		}
		const response = await AnalyticService.analyticOrderAdmin(idSeller, typeDate, startDay);
		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ message: error });
	}
};
const analyticProductAdmin = async (req, res) => {
	try {
		const { typeDate, startDay } = req.body;

		if (!typeDate) {
			return res.status(200).json({
				status: "ERROR",
				message: "Vui lòng nhập đầy đủ thông tin",
			});
		}
		const response = await AnalyticService.analyticProductAdmin(typeDate, startDay);
		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ message: error });
	}
};
const analyticOrderAdmin = async (req, res) => {
	try {
		const { typeDate, startDay } = req.body;

		if (!typeDate) {
			return res.status(200).json({
				status: "ERROR",
				message: "Vui lòng nhập đầy đủ thông tin",
			});
		}
		const response = await AnalyticService.analyticOrderAdmin(typeDate, startDay);
		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ message: error });
	}
};
const analyticCategoryAdmin = async (req, res) => {
	try {
		const response = await AnalyticService.analyticCategoryAdmin();
		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ message: error });
	}
};

module.exports = {
	analyticProduct,
	analyticOrder,
	analyticProductAdmin,
	analyticOrderAdmin,
	analyticCategoryAdmin,
};
