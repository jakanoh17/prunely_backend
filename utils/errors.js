const badRequest = { status: 400, message: "Invalid data passed in request" };
const notFound = {
  status: 404,
  message:
    "Resource does not exist OR request was sent to non-existent address",
};
const serverError = {
  status: 500,
  message: "An error has occured on the server",
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
    "There is a conflict with state of the requests. (IE duplicate users)",
};

function mapAndSendErrors(err, res) {
  const errorMapping = {
    ValidationError: badRequest,
    11000: conflictError,
    CastError: badRequest,
    [notFound.message]: notFound,
    [forbiddenError.message]: forbiddenError,
    [unauthorizedUserError.message]: unauthorizedUserError,
    [badRequest.message]: badRequest,
  };

  const errorResponse =
    errorMapping[err.name] ||
    errorMapping[err.message] ||
    errorMapping[err.code] ||
    serverError;

  res.status(errorResponse.status).send({ message: errorResponse.message });
}

module.exports = {
  badRequest,
  notFound,
  unauthorizedUserError,
  forbiddenError,
  mapAndSendErrors,
};
