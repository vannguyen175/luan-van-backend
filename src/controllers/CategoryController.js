const Category = require("../models/CategoryModel");
const categoryService = require("../services/CategoryService");

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(200).json({
                status: "ERR",
                message: "The input is required",
            });
        }
        const response = await categoryService.createCategory(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
};

const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const name = req.body;
        if (!name) {
            return res.status(200).json({
                status: "ERROR",
                message: "name field is required",
            });
        }
        const response = await categoryService.updateCategory(id, name);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await categoryService.deleteCategory(id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
};

const getAllCategory = async (req, res) => {
    try {
        const response = await categoryService.getAllCategory();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
};

const detailCategory = async (req, res) => {
    try {
        const id = req.params.id
        const response = await categoryService.detailCategory(id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
};



module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategory,
    detailCategory
};
