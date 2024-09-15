const users = require("express").Router();
const {
  getCurrentUser,
  loginUser,
  registerUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

users.get("/me", auth, getCurrentUser);
users.post("/", loginUser);
users.post("/", registerUser);
