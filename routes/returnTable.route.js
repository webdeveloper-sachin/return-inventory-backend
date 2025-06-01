const express = require("express");
const { getReturnTableRecords, addReturnTableRecord, deleteReturnTableRecord } = require("../controllers/returnTable.controller");
const router = express.Router();

router.route("/get-records").get(getReturnTableRecords);
router.route("/add-record").post(addReturnTableRecord);
router.route("/delete-record").delete(deleteReturnTableRecord);


module.exports = router;