const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Decode JWT token
router.use((req, res, next) => {
  // Get token from cookies
  const token = req.cookies.token ? req.cookies.token : null;

  if (!token) {
    return res.status(401).send("token not provided");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // For using in next middleware
    req.userId = decodedToken.userId;
    req.userEmail = decodedToken.email;
    req.userRole = decodedToken.role;

    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .clearCookie("token", {
        sameSite: "none",
        secure: true,
      })
      .send("token expired");
  }
});

module.exports = router;
