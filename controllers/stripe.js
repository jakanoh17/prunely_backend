const { STRIPE_KEY } = require("../utils/config");
const stripe = require("stripe")(STRIPE_KEY);
const { badRequestError } = require("../utils/errors");
const User = require("../models/user");

const createCustomerPortalSession = async (req, res, next) => {
  const { customerId, returnUrl } = req.body;

  if (!(customerId || returnUrl)) throw new Error(badRequestError.message);
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl, // The URL users are redirected to after leaving the portal
    });
    res.status(200).send({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    next(err);
  }
};

const createStripeCustomer = async (req, res) => {
  const { email, username, id } = req.foundNewUser;
  const submittedStripeInfo = await stripe.customers.create({
    email,
    name: username,
    metadata: { userId: id }, // Optional: Map your system's user ID to the customer
  });
  const userData = await User.findByIdAndUpdate(
    id,
    { stripeInfo: submittedStripeInfo },
    { new: true }
  );
  res.status(201).send(userData);
};

module.exports = { createCustomerPortalSession, createStripeCustomer };
