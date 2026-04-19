// server.js — GLOW UP Backend Entry Point
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// ─── Connect DB ───────────────────────────────────────────────────────────────
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// Health check
app.get("/api/health", (req, res) =>
  res.json({
    success: true,
    message: "🌿 GLOW UP API is running",
    env: process.env.NODE_ENV,
  }),
);

// 404
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" }),
);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5501;
app.listen(PORT, () => {
  console.log(`🚀  Server running on http://localhost:${PORT}`);
  console.log(`📦  Environment: ${process.env.NODE_ENV || "development"}`);
});
