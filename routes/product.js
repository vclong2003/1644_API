var express = require("express");
var router = express.Router();

const { product } = require("../models");

// Add products (allowed: 'staff', 'admin')
/*
name: String,
thumbnailUrl: String,
description: String,
price: Number,
stock: Number,
*/
router.post("/", async (req, res) => {
  const userRole = req.userRole;
  if (
    !userRole ||
    (!userRole.includes("staff") && !userRole.includes("admin"))
  ) {
    return res.sendStatus(403);
  }

  const name = req.body.name;
  const thumbnailUrl = req.body.thumbnailUrl;
  const description = req.body.description;
  const price = req.body.price;
  const stock = req.body.stock;
  if (!name || !thumbnailUrl || !description || !price || !stock) {
    return res.sendStatus(400);
  }

  let newProduct;
  try {
    newProduct = await product.create({
      name: name,
      thumbnailUrl: thumbnailUrl,
      description: description,
      price: price,
      stock: stock,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

  return res.status(200).json(newProduct);
});

router.get("/test", (req, res) => {
  return res.json({ id: req.userId, email: req.email });
});

module.exports = router;
