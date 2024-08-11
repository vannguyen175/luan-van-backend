const mongoose = require("mongoose");

const OrderStatus = {
	0: "Đang xử lý",
	1: "Đang vận chuyển",
	2: "Giao hàng",
	3: "Đã giao",
	4: "Đã hủy",
};

const orderSchema = new mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},

		paymentMethod: {
			type: String,
			enum: ["cash", "autopay"],
		},
		shippingDetail: {
			email: { type: String, required: true }, //email_buyer
			address: { type: String, required: true }, //address_buyer
			phone: { type: Number, required: true }, //phone_buyer
			shippingPrice: { type: Number, required: true },
			isPaid: { type: Boolean, default: false }, //da thanh toan hay chua (đối với paymentMethod = "cash")
			deliveredAt: { type: Date }, //thời điểm giao hàng thành công
		},
		buyer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		seller: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		status: { type: String, default: OrderStatus[0], required: true },
		cancelReason: { type: String },
	},
	{
		timestamps: true,
	}
);
const Order = mongoose.model("Order", orderSchema);
module.exports = { Order, OrderStatus };
