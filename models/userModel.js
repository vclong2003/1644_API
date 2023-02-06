const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  info: { name: String, dob: Date, phoneNumber: String },
});

module.exports = mongoose.model("User", userSchema);
