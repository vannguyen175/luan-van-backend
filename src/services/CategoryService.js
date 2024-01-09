const Category = require("../models/CategoryModel.js");

const createCategory = (newCategory) => {
    return new Promise(async (resolve, reject) => {
        const { name, subCategory } = newCategory;

        try {
            console.log(subCategory);
            const createCategory = await Category.create({
                name,
                subCategory: subCategory,
            });

            if (createCategory) {
                resolve({
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

const addSubCategory = (cateID, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkCategory = await Category.findOne({ _id: cateID });
            if (checkCategory === null) {
                resolve({
                    status: "OK",
                    message: "Category is not exists",
                });
            }

            const isExists = await Category.findOne({
                _id: cateID,
                subCategory: data.subCategory,
            });
            console.log(isExists);
            if (isExists) {
                resolve({
                    status: "OK",
                    message: "Sub-category is already exists",
                });
            }
            const addCategory = await Category.findByIdAndUpdate(
                cateID,
                {
                    $push: {
                        subCategory: data.subCategory,
                    },
                },
                { new: true }
            );

            if (addCategory) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: addCategory,
                });
            }
        } catch (error) {
            reject(error);
            console.log(error);
        }
    });
};

const deleteSubCategory = (cateID, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkCategory = await Category.findOne({
                _id: cateID,
                subCategory: data.subCategory,
            });
            console.log(checkCategory);
            if (checkCategory === null) {
                resolve({
                    status: "OK",
                    message: "Value want to delete is not exists",
                });
            }

            const deleteSubCategory = await Category.findByIdAndUpdate(
                cateID,
                { $pull: { subCategory: data.subCategory } },
                { new: true }
            );

            if (deleteSubCategory) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    deleteSubCategory,
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
    deleteSubCategory,
    addSubCategory,
};
