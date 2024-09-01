const { Server } = require("socket.io");

const productService = require("../../services/ProductService");
const orderService = require("../../services/OrderService");

// SOCKET.IO
const io = new Server({
	cors: {
		origin: "http://localhost:3006", //localhost fontend
	},
});

let onlineUsers = [];

const addNewUser = (userId, socketId) => {
	!onlineUsers.some((user) => user.userId === userId) && onlineUsers.push({ userId, socketId });
	console.log("onlineUsers", onlineUsers);
};

const removeUser = (socketId) => {
	onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
	return onlineUsers.find((user) => user.userId === userId.toString());
};

const onConnection = (socket) => {
	socket.on("newUser", (userId) => {
		addNewUser(userId, socket.id);
	});

	socket.on("disconnect", (socket) => {
		//removeUser(socket.id);
	});
};

productService.socket(io, getUser);
orderService.socket(io, getUser);

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
