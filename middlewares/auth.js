const jwt = require("jsonwebtoken");
const JWT_TOKEN = require("../utils/config");
const { unauthorizedUserError, mapAndSendErrors } = require("../utils/errors");

const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new Error(unauthorizedUserError.message);
  }
  // payload contains user._id
  try {
    const token = authorization.replace("Bearer ", "");
    await jwt.verify(token, JWT_TOKEN, (err, decoded) => {
      if (!err) {
        req.user = decoded;
        return;
      }
      throw new Error(unauthorizedUserError.message);
    });
  } catch (err) {
    mapAndSendErrors(err, res);
  }
  next();
};

module.exports = auth;
