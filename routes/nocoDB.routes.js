const express = require("express");
const getAllRecordsFromNocoDb = require("../controllers/nocodbLocation.controller");
const getAllOrdersRecordsFromNocoDb = require("../controllers/nocoDbOrder.controller");
const router = express.Router();

router.route("/get-all-location").get(getAllRecordsFromNocoDb)
router.route("/get-all-orders").get(getAllOrdersRecordsFromNocoDb)


module.exports = router;