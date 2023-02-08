const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Verify token
router.get("/*", (req, res, next) => {
  // Get token from header (Bearer token)
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

    // For using in next middleware
    req.userId = decodedToken.userId;
    req.email = decodedToken.email;
    req.role = decodedToken.role;

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).send("token expired");
  }
});

module.exports = router;
