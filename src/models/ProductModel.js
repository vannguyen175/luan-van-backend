const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		idUser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		}, //ID_user
		name: { type: String, required: true },
		sellerName: { type: String, required: true },
		images: [],
		subCategory: { type: String, required: true },
		stateProduct: {
			type: String,
			enum: ["new", "used"],
		},
		info: { type: Object, required: true },
		price: { type: Number, required: true },
		description: { type: String },
		address: { type: String, required: true },
		statePost: { type: String, enum: ["waiting", "approved", "reject"], default: "waiting" },
		selled: { type: Boolean, default: false }, //tinh trang hang da duoc ban hay chua
	},
	{
		timestamps: true,
	}
);
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
