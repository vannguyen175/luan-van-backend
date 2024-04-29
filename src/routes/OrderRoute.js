const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");

router.post("/create", orderController.createOrder);
router.get("/getAll/:id", orderController.getUserOrder); //đơn hàng đã mua của người mua
router.post("/getAll/seller/:id", orderController.getSellerOrder); //đơn hàng đã bán của người bán
router.put("/update/:id", orderController.updateOrder); //đơn hàng đã bán của người bán
router.post("/analytics", orderController.analyticOrder); 
router.get("/chart-analytics/:id", orderController.ChartAnalyticOrder); 


module.exports = router;
