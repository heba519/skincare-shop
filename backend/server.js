// server.js — GLOW UP Backend Entry Point
/*require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const path = require("path");
const routes = require("./routes/productRoutes");
// أضفه قبل الـ Routes
app.use(express.static(path.join(__dirname, "public")));

// ─── Connect DB ───────────────────────────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

//ي حد يطلب /images/... → روح هاته من public/images
app.use("/images", express.static("public/images"));

// Health check
app.get("/api/health", (req, res) =>
  res.json({
    success: true,
    message: "🌿 GLOW UP API is running",
    env: process.env.NODE_ENV,
  }),
);

///////////////
//app.use(express.json());
//app.use(routes);

// 404
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" }),
);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀  Server running on http://localhost:${PORT}`);
  console.log(`📦  Environment: ${process.env.NODE_ENV || "development"}`);
});
*/
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");

const app = express();

// ─── DB ─────────────────────────────
connectDB();

// ─── Middleware ─────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Static Files ───────────────────
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static("public/images"));

// ─── Routes ─────────────────────────
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "🌿 GLOW UP API is running",
  });
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
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
