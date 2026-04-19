// controllers/productController.js — Products Business Logic

const Product = require("../models/Product");

// ─── GET /api/products ────────────────────────────────────────────────────────
// Query params: category, maxPrice, sort, featured, page, limit
const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      maxPrice,
      sort,
      featured,
      page = 1,
      limit = 50,
    } = req.query;

    // Build filter object
    const filter = {};
    if (category && category !== "all") filter.category = category;
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };
    if (featured === "true") filter.featured = true;

    // Build sort object
    const sortMap = {
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      name: { name: 1 },
      rating: { rating: -1 },
      default: { createdAt: -1 },
    };
    const sortObj = sortMap[sort] || sortMap["default"];

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/products/featured ───────────────────────────────────────────────
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).sort({
      createdAt: -1,
    });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/products/categories ─────────────────────────────────────────────
const getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/products/:id ────────────────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/products ───────────────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── PUT /api/products/:id ────────────────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── DELETE /api/products/:id ─────────────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllProducts,
  getFeaturedProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
