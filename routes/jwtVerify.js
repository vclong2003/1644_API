const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Verify token
router.get("/*", (req, res, next) => {
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
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).send("token expired");
  }
});

module.exports = router;
