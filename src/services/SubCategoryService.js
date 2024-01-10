const Category = require("../models/CategoryModel");
const SubCategory = require("../models/Sub_categoryModel");

// path: /sub-category/create
const createSubCategory = (name, category) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkCategory = await Category.findById(category);
            if (checkCategory === null) {
                return resolve({
                    status: "OK",
                    message: "Category is not exists",
                });
            }
            const checkSubCategory = await SubCategory.findOne({ name });
            if (checkSubCategory) {
                return resolve({
                    status: "OK",
                    message: "Sub-category is already exists",
                });
            }

            const createSubCategory = await SubCategory.create({
                name: name,
                category: category,
            });

            if (createSubCategory) {
                return resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createSubCategory,
                });
            }
        } catch (error) {
            reject(error);
            console.log(error);
        }
    });
};

// path: /sub-category/update/:id
const updateSubCategory = (id, name) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkID = await SubCategory.findById(id);
            if (checkID === null) {
                return resolve({
                    status: "ERROR",
                    status: "Sub-category doesn't exists",
                });
            }
            const checkSubCategory = await SubCategory.findOne({ name: name });
            if (checkSubCategory) {
                return resolve({
                    status: "ERROR",
                    status: "Sub-category's name is already exists",
                });
            }
            const updateSubCategory = await SubCategory.findByIdAndUpdate(
                id,
                { name },
                {
                    new: true,
                }
            );
            if (updateSubCategory) {
                return resolve({
                    status: "OK",
                    message: "SUCCESS",
                    updateSubCategory,
                });
            }
        } catch (error) {
            reject(error);
            console.log(error);
        }
    });
};

// path: /sub-category/delete/:id
const deleteSubCategory = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkExists = await SubCategory.findById(id);
            if (checkExists === null) {
                resolve({
                    status: "ERROR",
                    message: "Sub-category is not exists",
                });
            }
            const deleteSubCategory = await SubCategory.findByIdAndDelete(id);
            if (deleteSubCategory) {
                resolve({
                    status: "SUCCESS",
                    message: "Delete sub-category successfully",
                });
            }
        } catch (error) {
            reject(error);
            console.log(error);
        }
    });
};


module.exports = {
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
};
