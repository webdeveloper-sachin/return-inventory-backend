const express = require("express");
const { getConfirmOrders, addToShip, getShippedOrders } = require("../controllers/confirmOrder.controller");
const router = express.Router();

router.route("/confirm-orders").get(getConfirmOrders);
router.route("/add-to-ship").post(addToShip);
router.route("/all-orders").get(getShippedOrders);



module.exports = router;