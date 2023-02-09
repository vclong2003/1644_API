const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { user } = require("../models");

//Register
router.post("/signup", async (req, res) => {
  let { email, password } = req.body;

  //Perform validation
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email) || !password) {
    return res.status(400).send("invalid request");
  }
  let existedUser = await user.findOne({ email: email });
  if (existedUser) {
    return res.status(400).send("user exsited");
  }

  password = bcrypt.hashSync(password, 10);
  const newUser = await user.create({
    email: email,
    password: password,
    role: ["customer"],
  });

  // Generate JWT
  const token = jwt.sign(
    { userId: newUser._id, email: newUser.email, role: newUser.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  return res.cookie("token", token).sendStatus(200);
});

// Login
router.post("/login", async (req, res) => {
  let { email, password } = req.body;

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
    {
      userId: currentUser._id,
      email: currentUser.email,
      role: currentUser.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  return res.cookie("token", token).sendStatus(200);
});

module.exports = router;
