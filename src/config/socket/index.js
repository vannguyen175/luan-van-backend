const { Server } = require("socket.io");

const productService = require("../../services/ProductService");
const orderService = require("../../services/OrderService");
const orderDetailService = require("../../services/OrderDetailService");
const ratingService = require("../../services/RatingService");

// SOCKET.IO
const io = new Server({
	cors: {
		origin: "http://localhost:3006", //localhost fontend
	},
});

// const io = require("socket.io")(server, {
// 	cors: {
// 		origin: "http://localhost:3006",
// 	},
// });

let onlineUsers = [];

// const addNewUser = (userId, socketId) => {
// 	!onlineUsers.some((user) => user.userId === userId) && onlineUsers.push({ userId, socketId });
// };

const addNewUser = (userId, socketId) => {
	const existingUser = onlineUsers.find((user) => user.userId === userId);
	if (existingUser) {
		existingUser.socketId = socketId; // Cập nhật ID mới nếu user đã có trong danh sách
	} else {
		onlineUsers.push({ userId, socketId }); // Thêm user mới nếu chưa có
	}
};

const removeUser = (socketId) => {
	onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
	return onlineUsers.find((user) => user.userId === userId.toString());
};

const onConnection = (socket) => {
	//console.log("New client connected " + socket.id);
	const idUser = socket.handshake.query.idUser; //lấy idUser từ param
	if (idUser !== "null" && idUser !== undefined) {
		addNewUser(idUser, socket.id);
	}
	//gửi sự kiện "getId" từ server tới client | emit = gửi
	//socket.emit("getId", { idSocket: socket.id, idUser: idUser });

	//sendDataClient: lắng nghe data từ client
	//sendDataServer: phát data đó từ server đến tất cả các clients
	socket.on("sendMessageClient", function (data) {
		const receiverUser = getUser(data.receiver);

		if (receiverUser && receiverUser.socketId) {
			io.to(receiverUser.socketId).emit("sendMessageServer", { data });
		}
		//io.emit("sendMessageServer", { data });
	});

	// socket.on("newUser", (userId) => {
	// 	addNewUser(userId, socket.id);
	// });

	socket.on("disconnect", (socket) => {
		removeUser(socket.id);
	});
};

productService.socket(io, getUser);
orderService.socket(io, getUser);
orderDetailService.socket(io, getUser);
ratingService.socket(io, getUser);

io.on("connection", onConnection);

// io.on("connection", (socket) => {
// 	socket.on("newUser", (userId) => {
// 		addNewUser(userId, socket.id);
// 	});
// 	socket.on("sendNotification", ({ senderId, reveiverId }) => {
// 		const reveiver = getUser(reveiverId);

// 		io.to(reveiver.socketId).emit("getNotification", { senderId });
// 	 });
// 	socket.on("sendNotification");
// 	socket.on("disconnect", (socket) => {
// 		//removeUser(socket.id);
// 	});
// });

io.listen(5000);

module.exports = { io };
