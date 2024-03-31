const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

//POST: /api/order/create
const createOrder = (newOrder) => {
	return new Promise(async (resolve, reject) => {
		const {
			orderItems,
			shippingAddress,
			phoneSeller,
			paymentMethod,
			itemPrice,
			shippingPrice,
			totalPrice,
			buyer,
			seller,
			isPaid = false,
			paidAt,
		} = newOrder;

		try {
			const productDetail = await Product.findById({ _id: orderItems.idProduct });
			const total_price = productDetail.price + shippingPrice;
			const checkOrder = await Order.findOne({
				"orderItems.product": orderItems.idProduct,
			});

			if (checkOrder) {
				return resolve({
					status: "ERROR",
					message: "Sản phẩm đã được bán",
				});
			} else {
				const createOrder = await Order.create({
					orderItems: {
						name: productDetail.name,
						image: productDetail.images[0].name,
						product: orderItems.idProduct,
					},
					shippingAddress: {
						address: shippingAddress.address,
						email: shippingAddress.email,
						phone: shippingAddress.phone,
					},
					paymentMethod,
					itemPrice: productDetail.price,
					shippingPrice,
					totalPrice: total_price,
					buyer,
					seller: productDetail.idUser,
					isPaid: false,
				});
				return resolve({
					status: "SUCCESS",
					message: "SUCCESS",
					data: createOrder,
				});
			}
		} catch (error) {
			console.log(`Have error at createOrder service: ${error}`);
		}
	});
};

// const updateProduct = (productID, data) => {
// 	return new Promise(async (resolve, reject) => {
// 		try {
// 			const checkProduct = await Product.findOne({ _id: productID });

// 			if (checkProduct === null) {
// 				reject({
// 					status: "ERROR",
// 					message: "Product is not exists",
// 				});
// 			} else {
// 				const updateProduct = await Product.findByIdAndUpdate(productID, data, {
// 					new: true,
// 				});

// 				return resolve({
// 					status: "OK",
// 					message: "SUCCESS",
// 					data: updateProduct,
// 				});
// 			}
// 		} catch (error) {
// 			console.log("error", error);
// 			reject(error);
// 		}
// 	});
// };

// const deleteProduct = () => {
// 	return new Promise(async (resolve, reject) => {
// 		try {
// 		} catch (error) {
// 			reject(error);
// 		}
// 	});
// };

// //url: /product/getAll/:slug      (slug: subCategory's slug)
// //chỉ lấy những sp đã duyệt
// const getAllProductsBySubCate = (slug, limit, page, sort, filter) => {
// 	return new Promise(async (resolve, reject) => {
// 		const id_subCategory = await SubCategory.findOne({ slug: slug });
// 		if (id_subCategory === null) {
// 			resolve({
// 				status: "ERROR",
// 				message: "Sub-category is not exist",
// 				data: createProduct,
// 			});
// 		}
// 		const id = id_subCategory._id;

// 		try {
// 			const totalProducts = await Product.find({
// 				subCategory: id,
// 				statePost: "approved",
// 			}).countDocuments(); //tong san pham co trong sub-category

// 			if (sort) {
// 				const objectSort = {};
// 				objectSort[sort[1]] = sort[0]; //url: ...sort=asc&sort=price
// 				const result = await Product.find({
// 					subCategory: id,
// 					statePost: "approved",
// 				})
// 					.limit(limit)
// 					.skip(limit * (page - 1))
// 					.sort(objectSort);

// 				resolve({
// 					status: "OK",
// 					message: "SUCCESS",
// 					data: result,
// 					totalProducts: totalProducts,
// 					pageCurrent: page,
// 					totalPages: Math.ceil(totalProducts / limit),
// 				});
// 			} else if (filter) {
// 				//url: ...filter=name&filter=iphone44
// 				const label = filter[0];
// 				const result = await Product.find({
// 					subCategory: id,
// 					statePost: "approved",
// 					[label]: { $regex: filter[1] },
// 				})
// 					.limit(limit)
// 					.skip(limit * (page - 1));

// 				resolve({
// 					status: "OK",
// 					message: "SUCCESS",
// 					data: result,
// 					totalProducts: totalProducts,
// 					pageCurrent: page,
// 					totalPages: Math.ceil(totalProducts / limit),
// 				});
// 			} else {
// 				const result = await Product.find({
// 					subCategory: slug,
// 					statePost: "approved",
// 				})
// 					.limit(limit)
// 					.skip(limit * (page - 1));
// 				resolve({
// 					status: "OK",
// 					message: "SUCCESS",
// 					data: result,
// 					totalProducts: totalProducts,
// 					pageCurrent: page,
// 					totalPages: Math.ceil(totalProducts / limit),
// 				});
// 			}
// 		} catch (error) {
// 			reject(error);
// 			console.log(error);
// 		}
// 	});
// };

// const getAllProducts = (limit, page, filter) => {
// 	return new Promise(async (resolve, reject) => {
// 		try {
// 			//tong san pham thỏa mãn filter (statePost: 'waiting')
// 			//dùng trong Quản lý bài đăng của Admin
// 			const totalProducts = await Product.find({ statePost: filter })
// 				.sort({ createdAt: "desc" })
// 				.countDocuments();
// 			{
// 				if (filter == "all") {
// 					const label = filter[0];
// 					const result = await Product.find({})
// 						.limit(limit)
// 						.skip(limit * (page - 1));

// 					resolve({
// 						status: "OK",
// 						message: "SUCCESS",
// 						data: result,
// 						totalProducts: totalProducts,
// 						pageCurrent: page,
// 						totalPages: Math.ceil(totalProducts / limit),
// 					});
// 				} else if (filter !== "all" && typeof filter !== "undefined") {
// 					const label = filter[0];
// 					const result = await Product.find({ statePost: filter })
// 						.sort({ createdAt: "desc" })
// 						.limit(limit)
// 						.skip(limit * (page - 1));
// 					resolve({
// 						status: "OK",
// 						message: "SUCCESS",
// 						data: result,
// 						totalProducts: totalProducts,
// 						pageCurrent: page,
// 						totalPages: Math.ceil(totalProducts / limit),
// 					});
// 				} else {
// 					const result = await Product.find({})
// 						.limit(limit)
// 						.skip(limit * (page - 1));

// 					resolve({
// 						status: "OK",
// 						message: "SUCCESS",
// 						data: result,
// 						totalProducts: totalProducts,
// 						pageCurrent: page,
// 						totalPages: Math.ceil(totalProducts / limit),
// 					});
// 				}
// 			}
// 		} catch (error) {
// 			reject(error);
// 			console.log(error);
// 		}
// 	});
// };
// const detailProduct = (id) => {
// 	return new Promise(async (resolve, reject) => {
// 		try {
// 			const result = await Product.findById({ _id: id });
// 			if (result === null) {
// 				return resolve({
// 					status: "ERROR",
// 					message: "Product's ID is not exist",
// 				});
// 			} else {
// 				return resolve({
// 					status: "OK",
// 					message: "SUCCESS",
// 					data: result,
// 				});
// 			}
// 		} catch (error) {
// 			console.log(error);
// 			reject(error);
// 		}
// 	});
// };

module.exports = {
	createOrder,
};
