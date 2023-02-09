const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");
const server = express();
const cors = require("cors");

server.use(logger("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(cors());

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
server.use("/api/auth", authRouter);

const jwtDecode = require("./routes/jwtDecode");

const productRouter = require("./routes/product");
server.use("/api/product", jwtDecode, productRouter);

const userRouter = require("./routes/user");
server.use("/api/user", jwtDecode, userRouter);

server.listen(process.env.SERVER_PORT);
