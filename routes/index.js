var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  console.log("called");
  res.json({ msg: "testjhbhj" });
});

module.exports = router;
