const Product = require("../models/ProductModel");
const SubCategory = require("../models/Sub_categoryModel");
const User = require("../models/UserModel");
const NotificationService = require("../services/NotificationService");
const cloudinary = require("../config/cloundiary/cloundiary.config");
const Seller = require("../models/SellerModel");
// const httpServer  = require("http").createServer();

const uploadImage = async (images) => {
	let newImageList = [];
	for (const image of images) {
		try {
			const result = await cloudinary.uploader.upload(image, {
				use_filename: true,
				unique_filename: false,
				overwrite: true,
			});
			newImageList.push(result.secure_url);
		} catch (error) {
			//console.log("HAVE AN ERROR =>", error);
		}
	}
	return newImageList;
};

const createProduct = async (newProduct) => {
	return new Promise(async (resolve, reject) => {
		try {
			const data_subCategory = await SubCategory.find({ slug: newProduct.subCategory });
			const newImages = await uploadImage(newProduct.images);
			if (newImages) {
				const createProduct = await Product.create({
					subCategory: data_subCategory[0].slug,
					name: newProduct.name,
					price: newProduct.price,
					idUser: newProduct.idUser, //idSeller
					address: newProduct.address,
					images: newImages,
					info: newProduct.info,
					stateProduct: newProduct?.stateProduct,
					quantity: newProduct.quantity,
					statePost: newProduct.totalSold >= 2 ? "approved" : "waiting",
				});
				if (createProduct) {
					const checkSellerExist = await Seller.findOne({ idUser: newProduct.idUser });
					if (checkSellerExist) {
						await Seller.findByIdAndUpdate(
							checkSellerExist._id,
							{
								$inc: { totalProduct: 1 },
							},
							{ new: true }
						);
					} else {
						await Seller.create({ idUser: checkSellerExist.idUser, totalProduct: 1 });
					}
				}
				resolve({
					status: "SUCCESS",
					message: "Tạo bài đăng thành công",
					data: createProduct,
				});
			}
		} catch (error) {
			console.log("Error at createProduct Service: ", error);
			reject(error);
		}
	});
};

let io; //biến io đã khởi tạo ở socket.js
let getUserSocketId; //hàm lấy socket userID

const socket = (socketIO, getUserSocketIdFn) => {
	io = socketIO;
	getUserSocketId = getUserSocketIdFn;
};

const updateProduct = (productID, data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkProduct = await Product.findOne({ _id: productID });

			if (checkProduct === null) {
				reject({
					status: "ERROR",
					message: "Bài đăng không tồn tại",
				});
			} else {
				const updateProduct = await Product.findByIdAndUpdate(productID, data, {
					new: true,
				});

				const userSocket = getUserSocketId(updateProduct.idUser);
				const addNoti = await NotificationService.addNotification({
					user: updateProduct.idUser,
					info: {
						product: updateProduct._id,
						image: updateProduct.images[0],
						navigate: "product",
						message: "Bài đăng của bạn đã được cập nhật.",
					},
				});
				if (userSocket) {
					io.to(userSocket.socketId).emit("getNotification", {
						unseenCount: addNoti.unseenCount,
					});
				}

				return resolve({
					status: "SUCCESS",
					message: "Cập nhật bài đăng thành công!",
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

//lấy tất cả sản phẩm (luôn lấy mới nhất)
const getAllProducts = (state, cate, subCate, page, limit, sort, seller) => {
	return new Promise(async (resolve, reject) => {
		try {
			const perPage = limit; //Số items trên 1 page
			const query = {};
			if (state.length > 0) {
				query.statePost = { $in: state };
			}

			if (seller) {
				query.idUser = seller;
			}
			//có lọc subCate hoặc Cate (có phân trang)

			if (subCate.length > 0 || cate.length > 0) {
				let products = await Product.find(query)
					.sort({ _id: -1 }) //lấy dữ liệu mới nhất
					.populate({
						path: "subCategory",
						model: "Sub_category",
						foreignField: "slug",
						match: subCate.length > 0 ? { name: { $in: subCate } } : {},
						populate: {
							path: "category",
							model: "Category",
							foreignField: "slug",
							match: cate.length > 0 ? { name: { $in: cate } } : {},
						},
					})
					.populate({
						path: "idUser", //idSeller
						select: "name blockExpireDate",
						match: { $or: [{ blockExpireDate: { $lte: new Date() } }, { blockExpireDate: null }] }, // chỉ lấy người bán không bị khóa
					});

				products = products.filter((product) => product.subCategory && product.subCategory.category && product.idUser);
				const paginatedProducts = products.slice((page - 1) * perPage, page * perPage);
				resolve({
					status: "OK",
					message: "Lấy tất cả sản phẩm thành công!",
					data: paginatedProducts,
					totalData: products.length,
				});
			} else {
				//lấy tất cả dữ liệu (có phân trang)
				const totalPages = await Product.countDocuments(query);
				let products = await Product.find(query)
					.sort({ _id: -1 }) //lấy dữ liệu mới nhất
					.skip(perPage * (page - 1)) // Bỏ qua các bản ghi của các trang trước
					.limit(perPage)
					.populate({
						path: "subCategory",
						model: "Sub_category",
						foreignField: "slug",
						populate: {
							path: "category",
							model: "Category",
							foreignField: "slug",
						},
					})
					.populate({
						path: "idUser", //idSeller
						select: "name",
						match: { $or: [{ blockExpireDate: { $lte: new Date() } }, { blockExpireDate: null }] }, // chỉ lấy người bán không bị khóa
					});
				products = products.filter((product) => product.idUser);
				resolve({
					status: "OK",
					message: "Lấy tất cả sản phẩm thành công!",
					data: products,
					totalData: totalPages,
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
			const result = await Product.findById({ _id: id })
				.populate({
					path: "subCategory",
					model: "Sub_category",
					foreignField: "slug",
					populate: {
						path: "category",
						model: "Category",
						foreignField: "slug",
					},
				})
				.populate({
					path: "idUser", //idSeller
					select: "name email",
				});

			if (result === null) {
				return resolve({
					status: "ERROR",
					message: "Có lỗi khi lấy dữ liệu",
				});
			} else {
				return resolve({
					status: "OK",
					message: "SUCCESS",
					data: result,
				});
			}
		} catch (error) {
			console.log("Error at detailProduct service", error);
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
	socket,
	createProduct,
	updateProduct,
	deleteProduct,
	getAllProductsBySubCate,
	getAllProducts,
	detailProduct,
	getProductSeller,
};
