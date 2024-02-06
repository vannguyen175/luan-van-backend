const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const { authMiddleware } = require("../config/middleware/authMiddleware");

router.get("/create", productController.createProduct);
// router.put("/update/:id", productController.updateProduct);
// router.delete("/delete/:id", authMiddleware, productController.deleteProduct);
router.get("/getAll/:slug", productController.getAllProducts);
// router.get("/details/:id", productController.detailProduct);

module.exports = router;
