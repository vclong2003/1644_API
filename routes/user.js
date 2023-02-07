const express = require("express");
const router = express.Router();

const { user } = require("../models");

router.get("/", async (req, res) => {
  const _id = req.userId;
  let currentUser;

  try {
    currentUser = await user.findOne({ _id: _id });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  return res.status(200).json({
    email: currentUser.email,
    role: currentUser.role,
    info: currentUser.info,
  });
});

module.exports = router;
