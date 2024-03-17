const { query } = require("express");
const ProductService = require("../services/ProductService");
const Logger = require("nodemon/lib/utils/log");

const createProduct = async (req, res) => {
	try {
		const {
			name,
			images,
			subCategory,
			stateProduct,
			info,
			price,
			description,
			idUser,
			address,
		} = req.body;

		if (!name || !images || !subCategory || !price || !info || !address) {
			return res.status(200).json({
				status: "ERROR",
				message: "Vui lòng nhập đầy đủ thông tin",
			});
		}
		const response = await ProductService.createProduct(req.body);
		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
		return res.status(404).json({ message: error });
	}
};

const updateProduct = async (req, res) => {
	try {
		const productID = req.params.id;
		const data = req.body;
		
		const response = await ProductService.updateProduct(productID, data);
		return res.status(200).json(response);
	} catch (error) {
		return res.status(404).json({ message: error });
	}
};
const deleteProduct = (req, res) => {
	try {
	} catch (error) {
		return res.status(404).json({ message: error });
	}
};
const getAllProductsBySubCate = async (req, res) => {
	try {
		const { limit, page, sort, filter } = req.query;
		const slug = req.params.slug; //subCategory's slug
		const response = await ProductService.getAllProducts(
			slug,
			Number(limit) || 10,
			Number(page) || 1,
			sort,
			filter
		);
		return res.status(200).json(response);
	} catch (error) {
		return res.status(404).json({ message: error });
	}
};

//không gồm sản phẩm đã bán
const getAllProducts = async (req, res) => {
	try {
		const { limit, page } = req.query;
		const { filter } = req.body;
		const response = await ProductService.getAllProducts(
			Number(limit) || 10,
			Number(page) || 1,
			filter
		);
		return res.status(200).json(response);
	} catch (error) {
		return res.status(404).json({ message: error });
	}
};
const detailProduct = (req, res) => {
	try {
	} catch (error) {
		return res.status(404).json({ message: error });
	}
};

module.exports = {
	createProduct,
	updateProduct,
	deleteProduct,
	getAllProductsBySubCate,
	getAllProducts,
	detailProduct,
};
