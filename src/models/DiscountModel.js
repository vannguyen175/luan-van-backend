const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
	idProduct: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }],
	message: [
		{
			sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người gửi
			content: { type: String, required: true }, // Nội dung tin nhắn
			timestamp: { type: Date, default: Date.now }, // Thời gian gửi
		},
	],
	isSeen: { type: Boolean, require: true, default: false },
});

const Discount = mongoose.model("Discount", discountSchema);
module.exports = Discount;
