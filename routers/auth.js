const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.post(
  "/signup",
  [
    body("name").trim().notEmpty(),
    body("email")
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already exists");
          }
        });
      }),
    body("password", "Please enter a valid password")
      .trim()
      .isLength({ min: 5 }),
  ],
  authController.postSignup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password", "Please enter a valid password")
      .trim()
      .isLength({ min: 5 }),
  ],
  authController.postLogin
);

module.exports = router;
