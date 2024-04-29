const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const { authMiddleware } = require("../config/middleware/authMiddleware");
const UploadRoute = require("./UploadRoute");

router.post("/create", productController.createProduct);
router.put("/update/:id", productController.updateProduct);
// router.delete("/delete/:id", authMiddleware, productController.deleteProduct);
router.get("/getAll/:slug", productController.getAllProductsBySubCate); //lấy product theo subCate
router.post("/getAll", productController.getAllProducts); //lấy tất cả product có lọc filter
router.get("/detail/:id", productController.detailProduct);
router.get("/getAll/seller/:id", productController.getProductSeller);

module.exports = router;
