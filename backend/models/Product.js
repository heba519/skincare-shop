// models/Product.js — Product Schema
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    brand: {
      type: String,
      default: "GLOW UP",
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "serums",
        "moisturizers",
        "cleansers",
        "sunscreen",
        "eyecare",
        "masks",
      ],
      lowercase: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    oldPrice: {
      type: Number,
      default: null,
    },
    badge: {
      type: String,
      enum: ["Best Seller", "Sale", "New", "Must-Have", "Premium", null],
      default: null,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    image: {
      type: String,
      required: [true, "Product image URL is required"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      default: 100,
      min: 0,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

// Index for fast filtering
productSchema.index({ category: 1, price: 1, featured: 1 });

module.exports = mongoose.model("Product", productSchema);
