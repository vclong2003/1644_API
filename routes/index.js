var express = require("express");
var router = express.Router();

const user = require("../models/userModel");

router.get("/", function (req, res, next) {
  const newUser = new user({ email: "dsjfdfsdf", password: "djfskjdf" });
});

module.exports = router;
