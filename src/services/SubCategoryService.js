const Category = require("../models/CategoryModel");
const SubCategory = require("../models/Sub_categoryModel");

// path: /sub-category/create
const createSubCategory = (name, slug, info) => {
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
					message: "SubCategory is already exists",
				});
			}
			const createSubCategory = await SubCategory.create({
				name: name,
				category: checkCategory._id,
				infoSubCate: [info],
			});
			if (createSubCategory) {
				return resolve({
					status: "SUCCESS",
					message: "SUCCESS",
					data: createSubCategory,
				});
			}
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
};

// path: /sub-category/update/:slug
const updateSubCategory = (slug, info) => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkID = await SubCategory.findOne({ slug });
			if (checkID === null) {
				return resolve({
					status: "ERROR",
					status: "Sub-category doesn't exists",
				});
			}
			const checkSubCategory = await SubCategory.findOne({ slug: slug });
			if (checkSubCategory) {
				const createSubCategory = await SubCategory.findOneAndUpdate(
					{ slug: slug },
					{ $push: { infoSubCate: info } }
				);

				return resolve({
					status: "SUCCESS",
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

//url: /sub-category/details/:slug
const detailSubCategory = (slug) => {
	return new Promise(async (resolve, reject) => {
		try {
			const detailSubCategory = await SubCategory.findOne({ slug: slug });
			if (detailSubCategory === null) {
				return resolve({
					status: "SUCCESS",
					message: "Sub-category is not exists",
				});
			}
			if (detailSubCategory) {
				const category = await Category.findById(detailSubCategory.category)
				return resolve({
					status: "SUCCESS",
					message: "Get details sub-category successfully",
					data: detailSubCategory,
					category: category
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
	detailSubCategory,
};
