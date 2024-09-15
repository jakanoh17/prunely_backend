const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const JWT_TOKEN = require("../utils/config");
const { notFound, badRequest, mapAndSendErrors } = require("../utils/errors");

function getCurrentUser(req, res) {
  // need to add authorization middleware that saves the _id in the req.user
  User.findById(req.user._id)
    .orFail(new Error(notFound.message))
    .then((currentUser) => {
      res.send(currentUser);
    })
    .catch((err) => {
      mapAndSendErrors(err, res);
    });
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new Error(badRequest.message);
    }

    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_TOKEN, { expiresIn: "7d" });
    res.send({ token });
  } catch (err) {
    mapAndSendErrors(err, res);
  }
};

const registerUser = async (req, res) => {
  const {
    username,
    email,
    profilePicture,
    password,
    subscriptionTier = "Free",
    // TODO: come back to this once register user page has been made
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      profilePicture,
      password: hash,
      subscriptionTier,
    });
    // TODO: decide on if I want to find the user then send the ok or if that's not really necessary
    // const foundUser = await User.findById(newUser._id);
    res.status(201).send(newUser);
  } catch (err) {
    // Could possibly throw 11000 error from MongoDB for duplicate user
    mapAndSendErrors(err, res);
  }
};

module.exports = { getCurrentUser, loginUser, registerUser };
