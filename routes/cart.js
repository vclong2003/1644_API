const express = require("express");
const router = express.Router();

const { cart } = require("../models");

/* Add/Update cart items
body: {<productId>: <quantity>}
*/
router.post("/", async (req, res) => {
  const { userId } = req;
  const items = req.body;

  let selectedCart;
  try {
    selectedCart = await cart.updateOne(
      {
        user: userId,
      },
      {
        $addToSet: {
          "items.$.product": "63e4647729ca6efb5d9a0d74",
        },
        $set: {},
      },
      { new: true, upsert: true }
    );
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

  return res.status(200).json(selectedCart);
});

module.exports = router;
