const Product = require("../models/ProductModel");
const Category = require("../models/CategoryModel");
const SubCategory = require("../models/Sub_categoryModel");

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, slug_subCate, price, description } = newProduct;
        const subCategory = await SubCategory.findOne({ slug: slug_subCate });
        const subCategoryID = subCategory._id;
        try {
            const createProduct = await Product.create({
                name,
                image,
                subCategory: subCategoryID,
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

//url: /product/getAll/:slug      (slug: subCategory's slug)
const getAllProducts = (slug, limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        const id_subCategory = await SubCategory.findOne({ slug: slug });
        console.log("slug", id_subCategory);
        if (id_subCategory === null) {
            resolve({
                status: "ERROR",
                message: "Sub-category is not exist",
                data: createProduct,
            });
        }
        const id = id_subCategory._id;

        try {
            const totalProducts = await Product.find({
                subCategory: id,
            }).countDocuments(); //tong san pham co trong sub-category

            if (sort) {
                const objectSort = {};
                objectSort[sort[1]] = sort[0]; //url: ...sort=asc&sort=price
                const result = await Product.find({
                    subCategory: id,
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
            } else if (filter) {
                //url: ...filter=name&filter=iphone44
                const label = filter[0];
                const result = await Product.find({
                    subCategory: id,
                    [label]: { $regex: filter[1] },
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
            } else {
                const result = await Product.find({
                    subCategory: id,
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
