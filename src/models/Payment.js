const mongoose = require("mongoose");

const Method = {
	0: "Thanh toán khi nhận hàng",
	1: "Chuyển khoản qua ngân hàng",
};

const paymentSchema = new mongoose.Schema(
	{
		idOrder: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Order",
			required: true,
		},

		method: {
			type: String,
			default: Method[0],
			required: true,
		},
	},
	{
		timestamps: true,
	}
);
const Payment = mongoose.model("Payment", paymentSchema);
module.exports = { Payment, Method };
