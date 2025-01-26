const jwt = require("jsonwebtoken");
const { JWT_TOKEN } = require("../utils/config");
const { unauthorizedUserError, forbiddenError } = require("../utils/errors");

const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new Error(unauthorizedUserError.message);
  }
  // payload contains user._id
  try {
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_TOKEN, (err, decoded) => {
      if (!err) {
        req.user = decoded;
        return;
      }
      throw new Error(unauthorizedUserError.message);
    });
    next();
  } catch (err) {
    next(err);
  }
};

const adminAuth = async (req, res, next) => {
  const { admin } = req.body;
  if (admin) {
    next();
  } else throw new Error(forbiddenError.message);
};

module.exports = { auth, adminAuth };
