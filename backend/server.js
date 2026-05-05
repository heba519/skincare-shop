require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");
const ejs = require("ejs");
const app = express();

// ─── DB ─────────────────────────────
connectDB();

// ─── Middleware ─────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ─── Static ─────────────────────────
app.use(express.static(path.join(__dirname, "public")));

// ─── Routes ─────────────────────────
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// optional dashboard API (لو فعلاً مستخدم)
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// ─── Health Check ───────────────────
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "GLOW UP API is running",
  });
});

//dashboard
app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});
// ─── 404 ────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ─── Error Handler ──────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
