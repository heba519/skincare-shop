// middleware/errorHandler.js — Global Error Handler

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format" });
  }

  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res
      .status(400)
      .json({ success: false, message: messages.join(", ") });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res
      .status(400)
      .json({ success: false, message: "Duplicate field value" });
  }

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
