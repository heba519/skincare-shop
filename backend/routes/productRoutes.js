// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getFeaturedProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Public routes
router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);

// Admin routes (add auth middleware here later)
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
