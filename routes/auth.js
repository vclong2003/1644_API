const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const user = require("../models/userModel");

router.get("/", (req, res) => {
  return res.send("test ok");
});

//Register
router.post("/signup", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email) || !password) {
    res.status(400);
    return res.send("invalid request");
  }

  let existedUser = await user.findOne({ email: email });
  if (existedUser) {
    res.status(400);
    return res.send("user exsited");
  }

  password = bcrypt.hashSync(password, 10);
  const newUser = await user.create({ email: email, password: password });
  console.log(newUser);

  res.status(200);
  return res.json({ test: "ok" });
});

// Login
router.post("/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email) || !password) {
    res.status(400);
    return res.send("invalid request");
  }

  let currentUser = await user.findOne({ email: email });

  if (!currentUser) {
    res.status(400);
    return res.send("user not found");
  }

  const passwordMatch = bcrypt.compareSync(password, currentUser.password);
  if (passwordMatch) {
    res.status(200);
    return res.json(currentUser);
  }

  res.status(400);
  return res.send("authentication error");
});

module.exports = router;
