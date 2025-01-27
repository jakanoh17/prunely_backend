require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { errors } = require("celebrate");

const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/prunely");
mongoose.set("strictQuery", true);

const { mapAndSendErrors, notFoundError } = require("./utils/errors");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;

const users = require("./routes/users");
const studySessions = require("./routes/studySessions");
const stripes = require("./routes/stripes");
const playlists = require("./routes/playlists");

app.use(cors());
app.use(express.json());

// LOG REQUESTS
app.use(requestLogger);

// ROUTES
app.use("/", users);
app.use("/sessions", studySessions);
app.use("/create-customer-portal-session", stripes);
app.use("/playlist", playlists);

// Not Found Middleware
app.use((req, res, next) => {
  next(notFoundError);
});

// Error Logging
app.use(errorLogger);

// Celebrate Validation Errors
app.use(errors());

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  mapAndSendErrors(err, res);
});

// Start Server
app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
