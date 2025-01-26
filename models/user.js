const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { unauthorizedUserError } = require("../utils/errors");
const stripeCustomerSchema = require("./stripeCustomer");

const userSchema = new mongoose.Schema({
  admin: { type: Boolean, require: false },
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Email input is not a valid email",
    },
    unique: true,
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Avatar input is not a valid URL",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  subscriptionTier: {
    type: String,
    validate: {
      validator: (v) => v === "Free" || "Premium",
      message: "Invalid subscription tier",
    },
    required: true,
  },
  stripeInfo: { type: stripeCustomerSchema, default: null }, // Stripe customer details
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(unauthorizedUserError.message));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error(unauthorizedUserError.message));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
