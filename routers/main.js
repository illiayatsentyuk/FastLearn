const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
router.get("/", isAuth, (req, res, next) => {
  res.send({ message: "Hello world" });
});

module.exports = router;
