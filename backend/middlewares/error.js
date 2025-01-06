module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  return res.status(err.statusCode).json({
    success: false,
    message: err.message, // Explicitly return the message
    statusCode: err.statusCode, // Explicitly return the status code
    // ...(process.env.NODE_ENV === "development" && { stack: err.stack }) // Stack trace in development
  });
};
