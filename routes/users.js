const users = require("express").Router();
const {
  getCurrentUser,
  loginUser,
  registerUser,
} = require("../controllers/users");
const { createStripeCustomer } = require("../controllers/stripe");
const { auth } = require("../middlewares/auth");

users.get("/me", auth, getCurrentUser);
users.post("/login", loginUser);
users.post("/signup", registerUser, createStripeCustomer);

module.exports = users;
