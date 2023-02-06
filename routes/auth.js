var express = require("express");
var router = express.Router();

const user = require("../models/userModel");

router.get("/", (req, res) => {
  return res.send("test ok");
});

module.exports = router;
