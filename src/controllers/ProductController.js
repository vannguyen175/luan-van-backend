const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
    try {
        const {
            name,
            image,
            category,
            subCategory,
            price,
            description,
        } = req.body;
        if (!name || !image || !category || !price || !description) {
            return res.status(200).json({
                status: "ERR",
                message: "The input is required",
            });
        }
        const response = await ProductService.createProduct(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
};

const updateProduct = (req, res) => {
    try {
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
const getAllProduct = (req, res) => {
    try {
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
    getAllProduct,
    detailProduct,
};
