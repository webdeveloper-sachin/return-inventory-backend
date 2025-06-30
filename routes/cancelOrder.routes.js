const express = require("express");
const {getCancelOrders, deleteCancelOrder} = require("../controllers/cancelOrder.controller");
const router = express.Router();

router.route("/cancel-orders").get(getCancelOrders);
router.route("/add/all-orders").post(deleteCancelOrder);


module.exports = router;