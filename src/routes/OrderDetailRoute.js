const express = require("express");
const router = express.Router();
const orderDetailController = require("../controllers/OrderDetailController");

router.post("/create", orderDetailController.createOrderDetail);
// router.post("/getAll", orderController.getOrders);
// router.post("/cancel", orderController.cancelOrder);
// router.put("/update/:id", orderController.updateOrder); //đơn hàng đã bán của người bán
// router.post("/analytics", orderController.analyticOrder);
// router.get("/chart-analytics/:id", orderController.ChartAnalyticOrder);

module.exports = router;
