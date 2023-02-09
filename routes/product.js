var express = require("express");
var router = express.Router();

const { product } = require("../models");

/*
Get all products

query value: searchVal, skip, limit, sort
supported sort type: 'dateAdded_asc', 'dateAdded_desc' , 'price_asc', 'name_desc', ...
*/
router.get("/", async (req, res) => {
  const searchVal = req.query.searchVal ? req.query.searchVal : "";
  const skip = req.query.skip ? req.query.skip : null;
  const limit = req.query.limit ? req.query.limit : null;
  const sort = req.query.sort
    ? { [req.query.sort.split("_")[0]]: req.query.sort.split("_")[1] }
    : { dateAdded: "desc" };

  let count;
  let products;
  try {
    const searchRegExp = new RegExp(`${searchVal}`, "i");

    count = await product.find({ name: searchRegExp }).count();
    products = await product
      .find({ name: searchRegExp }, "-description -dateAdded")
      .sort(sort)
      .skip(skip)
      .limit(limit);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

  return res.status(200).json({ count: count, data: products });
});

/*
Get single product
*/
router.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  let selectedProduct;
  try {
    selectedProduct = await product.find({ _id: productId });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  return res.status(200).json(selectedProduct);
});

/*
Add products (allowed: 'staff', 'admin')

name: String,
thumbnailUrl: String,
description: String,
price: Number,
stock: Number,
*/
router.post("/", async (req, res) => {
  const { userRole } = req;
  if (
    !userRole ||
    (!userRole.includes("staff") && !userRole.includes("admin"))
  ) {
    return res.sendStatus(403);
  }

  // JS destructuring
  const { name, thumbnailUrl, description, price, stock } = req.body;

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
      dateAdded: new Date().toJSON(),
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

  return res.status(200).json(newProduct);
});

/*
Update product (allowed: 'staff', 'admin'), find product by id

name: String,
thumbnailUrl: String,
description: String,
price: Number,
stock: Number,
 *not all field is required
*/
router.put("/:productId", async (req, res) => {
  const { userRole } = req;
  if (
    !userRole ||
    (!userRole.includes("staff") && !userRole.includes("admin"))
  ) {
    return res.sendStatus(403);
  }

  const { name, thumbnailUrl, description, price, stock } = req.body;

  const { productId } = req.params;
  let selectedProduct;
  try {
    selectedProduct = await product.findOneAndUpdate(
      { _id: productId },
      {
        name: name,
        thumbnailUrl: thumbnailUrl,
        description: description,
        price: price,
        stock: stock,
      },
      { new: true }
    );
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  return res.status(200).json(selectedProduct);
});

/*
Delete product (allowed: 'staff', 'admin'), find product by id
*/
router.delete("/:productId", async (req, res) => {
  const { userRole } = req;
  if (
    !userRole ||
    (!userRole.includes("staff") && !userRole.includes("admin"))
  ) {
    return res.sendStatus(403);
  }

  const { productId } = req.params;
  try {
    await product.findOneAndDelete({ _id: productId });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  return res.sendStatus(200);
});

module.exports = router;
