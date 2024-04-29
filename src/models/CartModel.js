const mongoose = require("mongoose");
var slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const cartSchema = new mongoose.Schema(
	{
		idUser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		idProduct: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
				required: true,
			},
		],
	},
	{
		timestamps: false,
	}
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
