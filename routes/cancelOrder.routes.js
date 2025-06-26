const express = require("express");
const getCancelOrders = require("../controllers/cancelOrder.controller");
const router = express.Router();

router.route("/cancel-orders").get(getCancelOrders);
// router.route("/cancel-order/delete").post();


module.exports = router;