const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		orderItems: {
			name: { type: String, required: true },
			image: { type: String, required: true },
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
				required: true,
			},
		},

		shippingAddress: {
			email: { type: String, required: true },
			address: { type: String, required: true },
			phone: { type: Number, required: true },
		},

		paymentMethod: {
			type: String,
			enum: ["cash", "autopay"],
		},
		itemPrice: { type: Number, required: true },
		shippingPrice: { type: Number, required: true },
		totalPrice: { type: Number, required: true },
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
		stateOrder: { type: String, enum: ["waiting", "approved", "reject"], default: "waiting" },
		isPaid: { type: Boolean, default: false }, //da thanh toan hay chua
		//paidAt: { type: Date }, //thoi diem thanh toan => createdAt
		isDelivered: { type: Boolean, default: false }, //da giao hang chua
		deliveredAt: { type: Date }, //giao hang vao luc nao
	},
	{
		timestamps: true,
	}
);
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
