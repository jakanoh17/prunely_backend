const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_TOKEN } = require("../utils/config");
const { notFoundError, badRequestError } = require("../utils/errors");

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .orFail(new Error(notFoundError.message))
    .then((currentUser) => {
      res.send(currentUser);
    })
    .catch(next);
}

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new Error(badRequestError.message);
    }

    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_TOKEN, { expiresIn: "7d" });
    res.send({ token });
  } catch (err) {
    next(err);
  }
};

const registerUser = async (req, res, next) => {
  const {
    admin = false,
    username,
    email,
    avatar,
    password,
    subscriptionTier = "Free",
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      admin,
      username,
      email,
      avatar,
      password: hash,
      subscriptionTier,
    });

    req.foundNewUser = await User.findById(newUser._id);
    next();
  } catch (err) {
    // Could possibly throw 11000 error from MongoDB for duplicate user
    next(err);
  }
};

module.exports = { getCurrentUser, loginUser, registerUser };
