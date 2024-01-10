const Product = require("../models/ProductModel");
const Category = require("../models/CategoryModel");

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, category, price, description, subCategory } =
            newProduct;
        try {
            const createProduct = await Product.create({
                name,
                image,
                category,
                subCategory,
                price,
                description,
            });
            if (createProduct) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createProduct,
                });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

const updateProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
        } catch (error) {
            reject(error);
        }
    });
};
const deleteProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
        } catch (error) {
            reject(error);
        }
    });
};
const getAllProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
        } catch (error) {
            reject(error);
        }
    });
};
const detailProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProduct,
    detailProduct,
};
