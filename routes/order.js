var express = require("express");
var router = express.Router();

const jwtDecode = require("./jwtDecode");
const { cart, order, user } = require("../models");

router.get("/", jwtDecode, async (req, res) => {
  const { userId } = req;
  let orders;

  try {
    orders = await order.find({ user: userId });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  return res.status(200).json(orders);
});

/* Create new order
body: {paymentMethod: <"COD"or "Bank transfer">,
*/
router.post("/", jwtDecode, async (req, res) => {
  const { userId } = req;
  const { paymentMethod } = req.body;
  let selectedCart;
  let totalBill = 0;
  let newOrder;

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
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

module.exports = router;
