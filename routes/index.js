var express = require("express");
var router = express.Router();

const user = require("../models/userModel");

router.get("/", function (req, res, next) {
  const newUser = new user({ email: "dsjfdfsdf", password: "djfskjdf" });
  newUser
    .save()
    .then((doc) => {
      console.log(doc);
    })
    .catch((err) => {
      console.log(err);
    })
    .then(() => {
      return res.send("ok");
    });
});

module.exports = router;
