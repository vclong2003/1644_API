var express = require("express");
var router = express.Router();

const jwtDecode = require("./jwtDecode");
const { cart, order, user } = require("../models");

router.get("/", jwtDecode, async (req, res) => {
  const { userId } = req;
  let orders;

  try {
    orders = await order
      .find({ user: userId })
      .populate("user", ["email"])
      .populate("items.product", ["name", "thumbnailUrl", "price"]);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  return res.status(200).json(orders);
});

/* Create new order
body: {
  paymentMethod: <"COD" or "Bank transfer">, 
  shippingAddress:{
    firstName: String,
    lastName: String,
    phone: String,
    detailedAddress: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  }}
*/
router.post("/", jwtDecode, async (req, res) => {
  const { userId } = req;
  const { paymentMethod, shippingAddress } = req.body;
  let selectedCart;
  let totalBill = 0;
  let newOrder;

  if (!paymentMethod || !shippingAddress) {
    return res.sendStatus(400);
  }

  try {
    selectedCart = await cart
      .findOne({ user: userId })
      .populate("items.product", ["price"]);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  if (selectedCart.items.length == 0) {
    return res.sendStatus(400);
  }

  selectedCart.items.forEach((item) => {
    totalBill += item.product.price * item.quantity;
  });

  try {
    newOrder = await order.create({
      user: userId,
      date: new Date().toJSON(),
      totalBill: totalBill,
      paymentMethod: paymentMethod,
      items: [...selectedCart.items],
    });

    newOrder.populate("user", ["email", "shippingAddress"]);
    newOrder.populate("items.product", ["name", "thumbnailUrl", "price"]);

    await selectedCart.set({ items: [] }).save();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  try {
    await user.findOneAndUpdate(
      { _id: userId },
      { shippingAddress: { ...shippingAddress } }
    );
  } catch (error) {
    console.log(err);
    return res.sendStatus(400);
  }

  return res.status(200).json(newOrder);
});

module.exports = router;
