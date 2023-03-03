const express = require("express");
const router = express.Router();

const { cart } = require("../models");
const jwtDecode = require("./jwtDecode");

/* View cart */
router.get("/", jwtDecode, async (req, res) => {
  const { userId } = req;

  let selectedCart;
  try {
    selectedCart = await cart
      .findOne({ user: userId })
      .populate("items.product", ["_id", "name", "thumbnailUrl", "price"]);
    if (!selectedCart) {
      selectedCart = await cart.create({ user: userId });
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

  return res.status(200).json(selectedCart);
});

/* Add item to cart
body: {product: <productId>}
*/
router.post("/", jwtDecode, async (req, res) => {
  const { userId } = req;
  const { product } = req.body;

  let selectedCart;
  try {
    selectedCart = await cart
      .findOneAndUpdate(
        { user: userId },
        {
          $addToSet: {
            items: { product: product },
          },
        },
        { new: true }
      )
      .populate("items.product", ["_id", "name", "thumbnailUrl", "price"]);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  return res.status(200).json(selectedCart);
});

/* Edit cart item
body: {product: <productId>, quantity: <quantity>}
*/
router.put("/", jwtDecode, async (req, res) => {
  const { userId } = req;
  const { product, quantity } = req.body;

  let selectedCart;
  try {
    selectedCart = await cart
      .findOneAndUpdate(
        { user: userId, "items.product": product },
        {
          $set: {
            "items.$.product": product,
            "items.$.quantity": quantity >= 1 ? quantity : 1,
          },
        },
        { new: true }
      )
      .populate("items.product", ["_id", "name", "thumbnailUrl", "price"]);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  return res.status(200).json(selectedCart);
});

/* Delete cart item
body: {product: <productId>}
*/
router.delete("/:productId", jwtDecode, async (req, res) => {
  const { userId } = req;
  const { productId } = req.params;

  let selectedCart;
  try {
    selectedCart = await cart
      .findOneAndUpdate(
        { user: userId },
        { $pull: { items: { product: productId } } },
        { new: true } 
      )
      .populate("items.product", ["_id", "name", "thumbnailUrl", "price"]);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  return res.status(200).json(selectedCart);
});

module.exports = router;
