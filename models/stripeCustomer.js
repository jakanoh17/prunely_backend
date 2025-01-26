const mongoose = require("mongoose");

const stripeCustomerSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Stripe Customer ID (e.g., "cus_12345")
  object: { type: String, default: "customer" }, // Should always be "customer"
  email: { type: String, default: null }, // Customer's email
  name: { type: String, default: null }, // Customer's name
  phone: { type: String, default: null }, // Customer's phone number
  description: { type: String, default: null }, // Customer description
  address: {
    line1: { type: String, default: null },
    line2: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    postal_code: { type: String, default: null },
    country: { type: String, default: null },
  }, // Address object
  balance: { type: Number, default: 0 }, // Account balance
  created: { type: Number, required: true }, // Timestamp when the customer was created
  currency: { type: String, default: "usd" }, // Default currency for the customer
  default_source: { type: String, default: null }, // ID of the default payment source
  metadata: { type: Map, of: String, default: {} }, // Key-value pairs for metadata
  invoice_prefix: { type: String, default: null }, // Prefix for invoice numbers
});

module.exports = stripeCustomerSchema;
