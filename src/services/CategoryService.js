const Category = require("../models/CategoryModel.js");
const SubCategory = require ("../models/Sub_categoryModel.js")

const createCategory = (newCategory) => {
    return new Promise(async (resolve, reject) => {
        const { name } = newCategory;
        try {
            const createCategory = await Category.create(
                { name },
                { new: true }
            );

            if (createCategory) {
                return resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createCategory,
                });
            }
        } catch (error) {
            reject(error);
            console.log(error);
        }
    });
};

const updateCategory = (id, name) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkCategory = await Category.findById(id);
            if (checkCategory === null) {
                return resolve({
                    status: "ERROR",
                    status: "Category is not exists",
                });
            }
            const updateCategory = await Category.findByIdAndUpdate(
                id,
                { name },
                {
                    new: true,
                }
            );
            if (updateCategory) {
                return resolve({
                    status: "OK",
                    message: "SUCCESS",
                    updateCategory,
                });
            }
        } catch (error) {
            reject(error);
            console.log(error);
        }
    });
};

const deleteCategory = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkCategory = await Category.findOne({ _id: id });
            if (checkCategory === null) {
                return resolve({
                    status: "ERROR",
                    message: "Category is not exists",
                });
            }

            const deleteCategory = await Category.findByIdAndDelete(id);

            if (deleteCategory) {
                return resolve({
                    status: "SUCCESS",
                    message: "Delete category successfully",
                });
            }
        } catch (error) {
            reject(error);
            console.log(error);
        }
    });
};

const getAllCategory = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const getAllCategory = await Category.find();
            if (getAllCategory) {
                return resolve({
                    status: "SUCCESS",
                    message: "Get all category successfully",
                    data: getAllCategory,
                });
            }
        } catch (error) {
            reject(error);
            console.log(error);
        }
    });
};

const detailCategory = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const detailCategory = await Category.findById(id);
            if (detailCategory === null) {
                return resolve({
                    status: "SUCCESS",
                    message: "Category is not exists",
                });
            }
            if (detailCategory) {
                const subCategories = await SubCategory.find({category: id});
                return resolve({
                    status: "SUCCESS",
                    message: "Get all category successfully",
                    category: detailCategory,
                    subCategory: subCategories
                });
            }
        } catch (error) {
            reject(error);
            console.log(error);
        }
    });
};

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategory,
    detailCategory,
};
