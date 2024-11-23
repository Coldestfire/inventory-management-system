// Validation.js
const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

const Validation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Collect all error messages in a user-friendly format
    const errorMessages = errors.array().map((err) => err.msg);
    throw new ApiError(400, errorMessages.join(', ')); // Joining errors into a single message
  }
  
  next(); // Proceed if no validation errors
};

module.exports = Validation;
