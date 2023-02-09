const express = require("express");
const router = express.Router();

/* Add/Update cart item */
router.post("/", (req, res) => {
  const { userId } = req;
  const { productId, quantity } = req.body;
});

module.exports = router;
