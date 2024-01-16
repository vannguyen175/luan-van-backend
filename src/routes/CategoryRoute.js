const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");
const { authMiddleware } = require("../config/middleware/authMiddleware");

router.get("/create", categoryController.createCategory);
router.put("/update/:slug", categoryController.updateCategory);
router.delete("/delete/:slug", categoryController.deleteCategory);
router.get("/getAll", categoryController.getAllCategory);
router.get("/details/:slug", categoryController.detailCategory);

module.exports = router;
