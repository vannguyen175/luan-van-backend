const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

//kiểm tra access token dành cho quản trị viên
const authMiddleware = (req, res, next) => {
	const token = req.headers.token.split(` `)[1];
	jwt.verify(token, "access_token", function (err, user) {
		if (err) {
			return res.status(404).json({ message: "The authemtication", status: "ERROR" });
		}
		if (user?.isAdmin) {
			next();
		} else {
			console.log(user);
			
			return res.status(404).json({
				message: "The authemtication 2",
				status: "ERROR",
			});
		}
	});
};

//kiểm tra access token
const authUserMiddleWare = (req, res, next) => {
	const token = req.headers.token.split(" ")[1];
	const userId = req.params.id;

	jwt.verify(token, "access_token", function (err, user) {
		if (err) {
			return res.status(404).json({
				status: "ERROR",
				message: "The authemtication",
			});
		}

		if (user?.isAdmin || user?.id === userId) {
			next();
		} else {
			return res.status(404).json({
				status: "ERROR",
				message: "The authemtication",
			});
		}
	});
};

module.exports = { authMiddleware, authUserMiddleWare };
