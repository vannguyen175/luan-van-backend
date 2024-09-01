const { Notification, NotiType } = require("../models/NotificationModel");

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
						navigate: data.info?.navigate,
						message: data.info?.message,
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
								navigate: data.info?.navigate,
								message: data.info?.message,
							},
						},
					},
					{ new: true }
				);
			}
			const unseenCount = await unSeenCount(data.user);
			//đảo ngược mới nhất xếp trước của mảng info
			if (NotiCreated && NotiCreated.info) {
				NotiCreated.info.reverse();
			}

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
			let unseenCount = 0;
			const notification = await Notification.findOne({ user: user });
			if (notification) {
				unseenCount = await unSeenCount(user);
			}
			//đảo ngược mới nhất xếp trước của mảng info
			if (notification && notification.info) {
				notification.info.reverse();
			}

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
