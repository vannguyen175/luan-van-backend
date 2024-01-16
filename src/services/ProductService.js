const Product = require("../models/ProductModel");
const Category = require("../models/CategoryModel");

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, subCategory, price, description } = newProduct;
        try {
            const createProduct = await Product.create({
                name,
                image,
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
const getAllProducts = (id_subCategory, limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        console.log(filter[1]);
        try {
            const totalProducts = await Product.find({
                subCategory: id_subCategory,
            }).countDocuments(); //tong san pham co trong sub-category

            if (sort) {
                const objectSort = {};
                objectSort[sort[1]] = sort[0]; //url: ...sort=asc&sort=price
                const result = await Product.find({
                    subCategory: id_subCategory,
                })
                    .limit(limit)
                    .skip(limit * (page - 1))
                    .sort(objectSort);

                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: result,
                    totalProducts: totalProducts,
                    pageCurrent: page,
                    totalPages: Math.ceil(totalProducts / limit),
                });
            } else {
                const result = await Product.find({
                    subCategory: id_subCategory,
                })
                    .limit(limit)
                    .skip(limit * (page - 1));

                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: result,
                    totalProducts: totalProducts,
                    pageCurrent: page,
                    totalPages: Math.ceil(totalProducts / limit),
                });
            }
        } catch (error) {
            reject(error);
            console.log(error);
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
    getAllProducts,
    detailProduct,
};
