const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const user = require("../models/userModel");

// Verify token
router.get("/", (req, res) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!token) {
    return res.status(400).send("token not provided");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken);
    return res.status(200).send("test ok");
  } catch (error) {
    console.log(error);
    return res.status(400).send("token expired");
  }
});

//Register
router.post("/signup", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email) || !password) {
    return res.status(400).send("invalid request");
  }

  let existedUser = await user.findOne({ email: email });
  if (existedUser) {
    return res.status(400).send("user exsited");
  }

  password = bcrypt.hashSync(password, 10);
  const newUser = await user.create({ email: email, password: password });
  console.log(newUser);

  return res.status(200).json({ test: "ok" });
});

// Login
router.post("/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email) || !password) {
    return res.status(400).send("invalid request");
  }

  let currentUser = await user.findOne({ email: email });

  if (!currentUser) {
    return res.status(400).send("user not found");
  }

  const passwordMatch = bcrypt.compareSync(password, currentUser.password);
  if (!passwordMatch) {
    return res.status(400).send("authentication error");
  }

  const token = jwt.sign(
    { userId: currentUser._id, email: currentUser.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  return res.status(200).json({
    email: currentUser.email,
    userId: currentUser._id,
    token: token,
  });
});

module.exports = router;
