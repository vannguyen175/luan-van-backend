const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");
const { authMiddleware } = require("../config/middleware/authMiddleware");

router.get("/create", categoryController.createCategory);
router.put("/add/:id", categoryController.addSubCategory);
router.delete("/delete-subCategory/:id", categoryController.deleteSubCategory);
// router.get("/getAll", categoryController.getAllCategory);
// router.get("/details/:id", categoryController.detailCategory);

module.exports = router;
