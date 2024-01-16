const Category = require("../models/CategoryModel");
const SubCategory = require("../models/Sub_categoryModel");

// path: /sub-category/create
const createSubCategory = (name, slug) => {
    //slug: category's slug
    return new Promise(async (resolve, reject) => {
        try {
            const checkCategory = await Category.findOne({ slug });

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
                category: checkCategory._id,
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

// path: /sub-category/update/:slug
const updateSubCategory = (slug, name) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkID = await SubCategory.findOne({ slug });
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
            const updateSubCategory = await SubCategory.findOneAndUpdate(
                { slug },
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

// path: /sub-category/delete/:slug
const deleteSubCategory = (slug) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkExists = await SubCategory.findOne({ slug });
            if (checkExists === null) {
                resolve({
                    status: "ERROR",
                    message: "Sub-category is not exists",
                });
            }
            const deleteSubCategory = await SubCategory.findOneAndDelete({
                slug,
            });
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
