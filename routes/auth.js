const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const user = require("../models/userModel");

router.get("/", (req, res) => {
  return res.send("test ok");
});

//email, password
router.post("/signup", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email) || !password) {
    res.status(400);
    return res.send("invalid request");
  }

  //   const newUser = new user({ email: email, password: password });
  //   newUser.save().then((doc) => {
  //     console.log(doc);
  //   });

  res.status(200);
  return res.json({ test: "ok" });
});

router.post("login", (req, res) => {});

module.exports = router;
