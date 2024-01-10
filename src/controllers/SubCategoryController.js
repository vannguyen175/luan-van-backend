const SubCategoryService = require("../services/SubCategoryService");

const createSubCategory = async (req, res) => {
    try {
        const { name, category } = req.body;
        
        if (!name) {
            return res.status(200).json({
                status: "ERR",
                message: "The input is required",
            });
        }
        const response = await SubCategoryService.createSubCategory(name, category);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(404).json({ message: error });
    }
};

const updateSubCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const name = req.body.name;
        if (!name) {
            return res.status(200).json({
                status: "ERROR",
                message: "name field is required",
            });
        }
        const response = await SubCategoryService.updateSubCategory(id, name);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
};

const deleteSubCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await SubCategoryService.deleteSubCategory(id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
};

module.exports = {
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
};
