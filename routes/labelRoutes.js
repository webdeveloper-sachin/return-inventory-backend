const express = require("express");
const printMrpLable = require("../controllers/mrpLabel.controller");
const router = express.Router();


router.route("/print").post(printMrpLable);


module.exports = router