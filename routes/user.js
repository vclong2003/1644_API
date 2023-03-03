const express = require("express");
const router = express.Router();

const jwtDecode = require("./jwtDecode");
const { user } = require("../models");

//get current user info
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
    shippingAddress: currentUser.shippingAddress,
  });
});

/* Update shipping address
body: {
    firstName: String,
    lastName: String,
    phone: String,
    detailedAddress: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  }
*/
router.post("/shippingAddress", jwtDecode, async (req, res) => {
  const userId = req.userId;
  const {
    firstName,
    lastName,
    phone,
    detailedAddress,
    city,
    state,
    postalCode,
    country,
  } = req.body;
  let currentUser;

  if (
    !firstName ||
    !lastName ||
    !phone ||
    !detailedAddress ||
    !city ||
    !postalCode ||
    !country
  ) {
    return res.sendStatus(400);
  }

  try {
    currentUser = await user.findOneAndUpdate(
      { _id: userId },
      {
        shippingAddress: {
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          detailedAddress: detailedAddress,
          city: city,
          state: state,
          postalCode: postalCode,
          country: country,
        },
      }
    );
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  return res.sendStatus(200);
});

module.exports = router;
