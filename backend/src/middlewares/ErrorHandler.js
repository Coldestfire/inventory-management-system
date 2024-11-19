const ApiError = require("../utils/ApiError");

const ErrorHandling = (err, req, res, next) => {

    // Ensure `err` has a valid structure
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message = err.message || "Something went wrong";

    // For unstructured errors (e.g., strings, undefined)
    if (typeof err !== "object") {
        err = { message: String(err), stack: "" };
    }

    const obj = {
        statusCode,
        message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    };

    // Ensure `statusCode` is a valid HTTP status code
    if (typeof obj.statusCode !== "number" || obj.statusCode < 100 || obj.statusCode > 599) {
        obj.statusCode = 500; // Fallback to 500 for invalid status codes
    }

    res.status(obj.statusCode).json(obj);
};

module.exports = ErrorHandling;
