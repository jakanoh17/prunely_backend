const badRequestError = {
  status: 400,
  message: "Invalid data passed in request",
};

const notFoundError = {
  status: 404,
  message:
    "Resource does not exist or request was sent to a non-existent address",
};

const serverError = {
  status: 500,
  message: "An error has occurred on the server",
};

const unauthorizedUserError = {
  status: 401,
  message: "Unauthorized user",
};

const forbiddenError = {
  status: 403,
  message: "You are not allowed to commit this action",
};

const conflictError = {
  status: 409,
  message:
    "There is a conflict with the state of the request (e.g., duplicate users)",
};

function mapAndSendErrors(err, res) {
  const errorMapping = {
    ValidationError: badRequestError, // Mongoose validation errors
    CastError: badRequestError, // Invalid MongoDB ObjectId
    11000: conflictError, // Duplicate key error in MongoDB
  };

  // Check for specific known errors
  const errorResponse =
    errorMapping[err.name] || // Mongoose/Other named errors
    errorMapping[err.code] || // MongoDB error codes
    errorMapping[err.message] || // Fallback for specific messages
    serverError; // Default to server error

  // Log the error (avoid sensitive info in production)
  console.error(`[Error]: ${err.stack || errorResponse.message}`);

  // Respond to the client
  res.status(errorResponse.status).send({ message: errorResponse.message });
}

module.exports = {
  badRequestError,
  notFoundError,
  serverError,
  unauthorizedUserError,
  forbiddenError,
  conflictError,
  mapAndSendErrors,
};
