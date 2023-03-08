var express = require("express");
var router = express.Router();

const jwtDecode = require("./jwtDecode");
const { cart, order, user } = require("../models");

/* Get all personal order
 */
router.get("/", jwtDecode, async (req, res) => {
  const { userId } = req;
  let orders;

  try {
    orders = await order
      .find({ user: userId }, "-items -shippingAddress -user")
      .sort({ date: "desc" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  return res.status(200).json(orders);
});

/* Get single order
 */
router.get("/:orderId", jwtDecode, async (req, res) => {
  const { userId, userRole } = req;
  const { orderId } = req.params;
  let selectedOrder;

  const queryParam = userRole.includes("staff")
    ? {
        _id: orderId,
      }
    : {
        _id: orderId,
        user: userId,
      };

  try {
    selectedOrder = await order
      .findOne(queryParam)
      .populate("user", ["email"])
      .populate("items.product", ["name", "thumbnailUrl", "price"]);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  return res.status(200).json(selectedOrder);
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

  // get current cart
  try {
    selectedCart = await cart
      .findOne({ user: userId })
      .populate("items.product", ["price"]);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  // check if cart empty
  if (selectedCart.items.length == 0) {
    return res.sendStatus(400);
  }

  // calculate the total bill
  selectedCart.items.forEach((item) => {
    totalBill += item.product.price * item.quantity;
  });

  // create new order
  try {
    newOrder = await order.create({
      user: userId,
      date: new Date().toJSON(),
      totalBill: totalBill,
      paymentMethod: paymentMethod,
      items: [...selectedCart.items],
      shippingAddress: { ...shippingAddress },
    });

    newOrder.populate("user", ["email"]);
    newOrder.populate("items.product", ["name", "thumbnailUrl", "price"]);

    await selectedCart.set({ items: [] }).save();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  // save address for auto-filling
  try {
    await user.findOneAndUpdate(
      { _id: userId },
      { shippingAddress: { ...shippingAddress } }
    );
  } catch (error) {
    console.log(err);
    return res.sendStatus(500);
  }

  return res.status(200).json(newOrder);
});

module.exports = router;
