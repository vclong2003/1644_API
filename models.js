const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  role: [{ type: String, enum: ["customer", "staff", "admin"] }],
  shippingAddress: {
    firstName: String,
    lastName: String,
    phone: String,
    detailedAddress: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
});
const user = mongoose.model("User", userSchema);

const productSchema = new mongoose.Schema({
  name: String,
  thumbnailUrl: String,
  description: String,
  price: Number,
  stock: Number,
  dateAdded: Date,
});
const product = mongoose.model("Product", productSchema);

const cartSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", unique: true },
      quantity: { type: Number, default: 1 },
      _id: false,
    },
  ],
});
const cart = mongoose.model("Cart", cartSchema);

const orderSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  date: Date,
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],
  totalBill: Number,
  paymentMethod: { type: String, enum: ["COD", "Bank transfer"] },
  shippingAddress: {
    firstName: String,
    lastName: String,
    phone: String,
    detailedAddress: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  status: {
    type: String,
    enum: ["Pending", "In progress", "Completed", "Returned", "Canceled"],
    default: "Pending",
  },
});
const order = mongoose.model("Order", orderSchema);

module.exports = { user, product, cart, order };
