var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  return res.status(200).send("okfffff");
});

router.get("/test", (req, res) => {
  return res.json({ id: req.userId, email: req.email });
});

module.exports = router;
