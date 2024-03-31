const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { required } = require("nodemon/lib/config");
const asyncHandler = require("express-async-handler");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

async function handleUpload(file) {
	const res = await cloudinary.uploader.upload(file, {
	  resource_type: "auto",
	});
	return res;
  }

// const uploadMultiple = asyncHandler(async (req, res, next) => {
// 	try {
// 		const images = req.files;
// 		const imageUrls = [];

// 		for (const image of images) {
// 			const result = await cloudinary.uploader.upload(image.path, {
// 				resource_type: "auto",
// 			});
// 			imageUrls.push(result.secure_url);
// 		}
// 		req.body.images = imageUrls;
// 		next();
// 	} catch (error) {
// 		console.log("uploadMultiple error", error);
// 		res.status(500).send(`Internal error at: uploadMultiple.js - ${error})`);
// 	}
// });

module.exports = handleUpload;
