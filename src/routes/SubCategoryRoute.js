const express = require("express");
const router = express.Router();
const subCategoryController = require("../controllers/subCategoryController.js");
const { authMiddleware } = require("../config/middleware/authMiddleware");

router.get("/create", subCategoryController.createSubCategory);
router.put("/update/:slug", subCategoryController.updateSubCategory);  //slug: name subCate
router.delete("/delete/:slug", subCategoryController.deleteSubCategory);
//router.get("/getAll", subCategoryController.getAllSubCategory);
router.get("/details/:slug", subCategoryController.detailSubCategory);

module.exports = router;
