const stripe = require("express").Router();
const { createCustomerPortalSession } = require("../controllers/stripe");

const { auth } = require("../middlewares/auth");

stripe.post("/", auth, createCustomerPortalSession);

module.exports = stripe;
