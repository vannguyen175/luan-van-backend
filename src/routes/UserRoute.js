const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { authMiddleware, authUserMiddleWare } = require("../config/middleware/authMiddleware");

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.post("/login-admin", userController.loginAdmin);
router.post("/logout", userController.logoutUser);
router.put("/update/:id", userController.updateUser);
router.delete("/delete/:id", authMiddleware, userController.deleteUser);
router.post("/getAll", authMiddleware, userController.getAllUsers);
router.get("/details/:id", authUserMiddleWare, userController.detailUser);
router.get("/info/:id",  userController.infoUser);
router.get("/search/:key", authMiddleware, userController.searchUser);
router.post("/refresh-token", userController.refreshToken);

module.exports = router;
