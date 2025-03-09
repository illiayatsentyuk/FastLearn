const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.postSignup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    const token = jwt.sign(
      { email: savedUser.email, userId: savedUser._id.toString() },
      "secret",
      { expiresIn: "1h" }
    );
    res.status(201).json({ token, userId: savedUser._id.toString() });
  } catch (err) {
    next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      "secret",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (err) {
    next(err);
  }
};
