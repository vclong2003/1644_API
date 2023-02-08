const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Connect to MongoDB
mongoose.set("strictQuery", true); // suppress warning
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((err) => {
    console.log("Failed to connect MongoDB: " + err);
  });

const authRouter = require("./routes/auth");
app.use("/api/auth", authRouter);

const jwtDecode = require("./routes/jwtDecode");

const productRouter = require("./routes/product");
app.use("/api/product", jwtDecode, productRouter);

const userRouter = require("./routes/user");
app.use("/api/user", jwtDecode, userRouter);

module.exports = app;
