const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, category, subCategory, price, description } =
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
