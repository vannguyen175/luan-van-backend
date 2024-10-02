const express = require("express");
const router = express.Router();
const analyticController = require("../controllers/AnalyticController")

router.post("/product", analyticController.analyticProduct);
router.post("/order", analyticController.analyticOrder);
router.post("/product-admin", analyticController.analyticProductAdmin);
router.post("/order-admin", analyticController.analyticOrderAdmin);
router.get("/category-admin", analyticController.analyticCategoryAdmin);
// router.put("/update", cartController.updateCart);
// router.get("/:id", cartController.getCart); //idUser
// router.put("/delete", cartController.deleteCart);

module.exports = router;