const express = require("express");
const { getPressTableRecords, createPressTableRecord, deletePressTableRecord } = require("../controllers/pressTable.controller");
const router = express.Router();

router.route("/get-records").get(getPressTableRecords);
router.route("/add-record").post(createPressTableRecord);
router.route("/delete-record").delete(deletePressTableRecord);

module.exports = router;