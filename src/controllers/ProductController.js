const { query } = require("express");
const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
    try {
        const { name, image, slug_subCate, price, description } = req.body;
        if (!name || !image || !slug_subCate || !price || !description) {
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
const getAllProducts = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query;
        const slug = req.params.slug;  //subCategory's slug
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
    getAllProducts,
    detailProduct,
};
