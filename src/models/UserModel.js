const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
	{
		name: { type: String },
		email: { type: String, required: true, unique: true },
		password: { type: String },
		isAdmin: { type: Boolean, default: false, required: true },
		access_token: { type: String, require: true },
		refresh_token: { type: String, require: true },
		avatar: { type: String },
		rating: { type: Number, required: true, default: 0 },
		totalSelled: { type: Number, default: 0 },
	},
	{
		new: true,
		timestamps: true,
	}
);
const User = mongoose.model("User", userSchema);
module.exports = User;
