const mongoose = require("mongoose");

const NotiType = {
	0: "Bài đăng của bạn đã được cập nhật", //product
	1: "Sản phẩm có người mua", //product
	2: "Giao hàng thành công", //product
	3: "Khách hàng đánh giá nhà bán hàng", //seller
	4: "Nhà bán hàng đã được nâng hạng",
};
const notificationSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

		info: [
			{
				seller: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				}, //ID_seller
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
				},
				image: { type: String },
				type: { type: String, require: true },
				isSeen: { type: Boolean, require: true, default: false },
			},
		], //seller, product
	},
	{
		new: true,
		timestamps: false,
	}
);
// Middleware để giới hạn số lượng phần tử trong mảng
notificationSchema.pre("save", function (next) {
	// Giới hạn mảng 'info' chỉ có tối đa 10 phần tử
	if (this.info.length > 10) {
		this.info = this.info.slice(-10);
	}
	next();
});
const Notification = mongoose.model("Notification", notificationSchema);
module.exports = { Notification, NotiType };
