const express = require("express");
const router = express.Router();

const { cart } = require("../models");

/* View cart */
router.get("/", async (req, res) => {
  const { userId } = req;

  let selectedCart;
  try {
    selectedCart = await cart.findOne({ user: userId });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

  return res.status(200).json(selectedCart);
});

/* Edit cart
body: [{product: <productId>, quantity: <quantity>}]
*/
router.post("/", async (req, res) => {
  const { userId } = req;
  const items = req.body;

  let selectedCart;
  try {
    selectedCart = await cart.findOneAndUpdate(
      { user: userId },
      { items: items },
      { new: true }
    );
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  return res.status(200).json(selectedCart);
});

module.exports = router;
