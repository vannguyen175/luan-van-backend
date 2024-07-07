const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		phone: { type: String, required: true },
		province: { type: String },
		district: { type: String },
		ward: { type: String },
		address: { type: String },
	},
	{
		new: true,
		timestamps: false,
	}
);
const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
