const express = require("express");
const router = express.Router();

const jwtDecode = require("./jwtDecode");
const { user } = require("../models");

router.get("/", jwtDecode, async (req, res) => {
  const userId = req.userId;

  let currentUser;
  try {
    currentUser = await user.findOne({ _id: userId });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  return res.status(200).json({
    id: currentUser._id,
    email: currentUser.email,
    role: currentUser.role,
  });
});

module.exports = router;
