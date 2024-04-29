const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartController");
const { authMiddleware } = require("../config/middleware/authMiddleware");

router.post("/create", cartController.createCart);
router.get("/:id", cartController.getCart);
router.post("/delete", cartController.deleteCart);

module.exports = router;
