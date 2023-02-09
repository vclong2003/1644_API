const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: [{ type: String, enum: ["customer", "staff", "admin"] }],
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
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  totalBill: Number,
});
const cart = mongoose.model("Cart", cartSchema);

const orderSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  address: { type: Schema.Types.ObjectId, ref: "Address" },
  date: Date,
  totalBill: Number,
  status: String,
});
const order = mongoose.model("Order", orderSchema);

const addressSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  name: String,
  phoneNumber: String,
  detail: String,
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
});
const address = mongoose.model("Address", addressSchema);

module.exports = { user, product, cart, order, address };
