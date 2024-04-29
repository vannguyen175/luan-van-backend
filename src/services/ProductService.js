const Product = require("../models/ProductModel");
const Category = require("../models/CategoryModel");
const SubCategory = require("../models/Sub_categoryModel");
const User = require("../models/UserModel");

const createProduct = (newProduct) => {
	return new Promise(async (resolve, reject) => {
		const {
			idUser,
			name,
			images,
			subCategory,
			stateProduct,
			info,
			price,
			description,
			address,
		} = newProduct;
		const sellerDetail = await User.findOne({ _id: idUser });
		const sellerName = sellerDetail.name;
		try {
			const createProduct = await Product.create({
				idUser,
				sellerName: sellerName,
				name,
				images,
				subCategory,
				stateProduct,
				info,
				price,
				description,
				address,
			});
			if (createProduct) {
				resolve({
					status: "SUCCESS",
					message: "Tạo bài đăng thành công",
					data: createProduct,
				});
			}
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
};

const updateProduct = (productID, data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkProduct = await Product.findOne({ _id: productID });

			if (checkProduct === null) {
				reject({
					status: "ERROR",
					message: "Product is not exists",
				});
			} else {
				const updateProduct = await Product.findByIdAndUpdate(productID, data, {
					new: true,
				});

				return resolve({
					status: "OK",
					message: "SUCCESS",
					data: updateProduct,
				});
			}
		} catch (error) {
			console.log("error", error);
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
//chỉ lấy những sp đã duyệt
const getAllProductsBySubCate = (slug, limit, page, sort, filter) => {
	return new Promise(async (resolve, reject) => {
		const id_subCategory = await SubCategory.findOne({ slug: slug });
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
				statePost: "approved",
				selled: false,
			}).countDocuments(); //tong san pham co trong sub-category

			if (sort) {
				const objectSort = {};
				objectSort[sort[1]] = sort[0]; //url: ...sort=asc&sort=price
				const result = await Product.find({
					subCategory: id,
					statePost: "approved",
					selled: false,
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
					statePost: "approved",
					selled: false,
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
					subCategory: slug,
					statePost: "approved",
					selled: false,
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

const getAllProducts = (limit, page, filter, onSale) => {
	return new Promise(async (resolve, reject) => {
		try {
			//tong san pham thỏa mãn filter (statePost: 'waiting')
			//dùng trong Quản lý bài đăng của Admin


			if (filter == "all") {
				const totalProducts = await Product.find()
					.sort({ createdAt: "desc" })
					.countDocuments();

				//const label = filter[0];
				const filter = onSale === true ? { isSelled: true } : {};
				const result = await Product.find(filter)
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
			} else if (filter !== "all" && typeof filter !== "undefined") {
				const totalProducts = await Product.find({ statePost: filter })
					.sort({ createdAt: "desc" })
					.countDocuments();
				const label = filter[0];
				if (onSale) {
					//lấy những sp đang được bán
					const result = await Product.find({
						statePost: filter,
						selled: "false",
					})
						.sort({ createdAt: "desc" })
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
						statePost: filter,
					})
						.sort({ createdAt: "desc" })
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
			} else {
				const result = await Product.find({})
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
const detailProduct = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await Product.findById({ _id: id });
			if (result === null) {
				return resolve({
					status: "ERROR",
					message: "Product's ID is not exist",
				});
			} else {
				return resolve({
					status: "OK",
					message: "SUCCESS",
					data: result,
				});
			}
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
};
const getProductSeller = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const sellerInfo = await User.findById(id);
			const result = await Product.find({ sellerName: sellerInfo.name, selled: false });
			if (result === null) {
				return resolve({
					status: "ERROR",
					message: "Product's ID is not exist",
				});
			} else {
				return resolve({
					status: "OK",
					message: "SUCCESS",
					data: result,
				});
			}
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
};

module.exports = {
	createProduct,
	updateProduct,
	deleteProduct,
	getAllProductsBySubCate,
	getAllProducts,
	detailProduct,
	getProductSeller,
};
