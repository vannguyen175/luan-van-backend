const { Notification, NotiType } = require("../models/NotificationModel");

// const NotiType = {
// 	0: "Bài đăng của bạn được cập nhật", //product
// 	1: "Sản phẩm có người mua", //product
// 	2: "Giao hàng thành công", //product
// 	3: "Khách hàng đánh giá nhà bán hàng", //seller
// 	4: "Nhà bán hàng đã được nâng hạng",
// };

const unSeenCount = async (user) => {
	try {
		const notification = await Notification.findOne({ user: user });
		const unseenCount = notification.info.filter((item) => item.isSeen === false).length;
		return unseenCount;
	} catch (error) {
		console.log(error);
		reject(error);
	}
};

//data = {user: id_seller, info: {product, buyer, type}}
const addNotification = async (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			let NotiCreated;
			const isExist = await Notification.findOne({ user: data.user });
			if (isExist === null) {
				NotiCreated = await Notification.create({
					user: data.user,
					info: {
						product: data.info?.product,
						buyer: data.info?.buyer,
						image: data.info?.image,
						type: NotiType[data.info.type],
					},
				});
			} else {
				//checkInfoLength();
				NotiCreated = await Notification.findOneAndUpdate(
					{ _id: isExist._id },
					{
						$push: {
							info: {
								product: data.info?.product,
								buyer: data.info?.buyer,
								image: data.info?.image,
								type: NotiType[data.info?.type],
							},
						},
					},
					{ new: true }
				);
			}
			const unseenCount = await unSeenCount(data.user);
			

			resolve({
				status: "SUCCESS",
				message: "Thêm thông báo thành công",
				data: NotiCreated,
				unseenCount: unseenCount,
			});
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
};
const getNotification = async (user) => {
	return new Promise(async (resolve, reject) => {
		try {
			const notification = await Notification.findOne({ user: user });
			const unseenCount = await unSeenCount(user);
			resolve({
				status: "SUCCESS",
				message: "Lấy thông báo thành công",
				data: notification,
				unseenCount: unseenCount,
			});
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
};
const updateNotification = async (user, infoID) => {
	return new Promise(async (resolve, reject) => {
		try {
			const notification = await Notification.findOneAndUpdate(
				{ user: user, "info._id": infoID },
				{
					$set: { "info.$.isSeen": true },
				},
				{ new: true }
			);
			resolve({
				status: "SUCCESS",
				message: "Cập nhật thông báo thành công",
				data: notification,
			});
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
};
module.exports = {
	addNotification,
	getNotification,
	updateNotification,
};
