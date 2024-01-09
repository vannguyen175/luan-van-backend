const Category = require("../models/CategoryModel");
const categoryService = require("../services/CategoryService");

const createCategory = async (req, res) => {
    try {
        const { name, subCategory } = req.body;

        if (!name || !subCategory) {
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

const addSubCategory = async (req, res) => {
    try {
        const cateID = req.params.id;
        const data = req.body;
        
        if (!data) {
            return res.status(200).json({
                status: "ERR",
                message: "The input is required",
            });
        }
        const response = await categoryService.addSubCategory(cateID, data);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
};

const deleteSubCategory = async (req, res) => {
    try {
        const cateID = req.params.id;
        const data = req.body;

        if (!data) {
            return res.status(200).json({
                status: "ERR",
                message: "The input is required",
            });
        }
        const response = await categoryService.deleteSubCategory(cateID, data);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
};

module.exports = {
    createCategory,
    deleteSubCategory,
    addSubCategory,
};
