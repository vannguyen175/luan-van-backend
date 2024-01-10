const express = require("express");
const router = express.Router();
const subCategoryController = require("../controllers/subCategoryController.js");
const { authMiddleware } = require("../config/middleware/authMiddleware");

router.get("/create", subCategoryController.createSubCategory);
router.put("/update/:id", subCategoryController.updateSubCategory);
router.delete("/delete/:id", subCategoryController.deleteSubCategory);
//router.get("/getAll", subCategoryController.getAllSubCategory);
// router.get("/details/:id", subCategoryController.detailSubCategory);

module.exports = router;
