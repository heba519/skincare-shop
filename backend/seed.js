// seed.js — Populate MongoDB with GLOW UP products
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/Product");

const products = [
  {
    name: "Vitamin C Brightening Serum",
    brand: "GLOW UP",
    category: "serums",
    price: 58,
    oldPrice: null,
    badge: "Best Seller",
    rating: 5,
    image: "/backend/public/images/Vitamin C serum to brighten skin.png",
    featured: true,
    stock: 80,
    description:
      "A potent 15% Vitamin C serum that visibly brightens dull skin and fades dark spots.",
  },
  {
    name: "Hyaluronic Acid Deep Hydration",
    brand: "GLOW UP",
    category: "serums",
    price: 46,
    oldPrice: 62,
    badge: "Sale",
    rating: 5,
    image: "/backend/public/images/Hyalu B5 Serum.png",
    featured: true,
    stock: 120,
    description:
      "Multi-weight hyaluronic acid formula that delivers intense hydration to all skin layers.",
  },
  {
    name: "Barrier Repair Moisturizer",
    brand: "GLOW UP",
    category: "moisturizers",
    price: 64,
    oldPrice: null,
    badge: null,
    rating: 4,
    image: "/backend/public/images/Barrier Repair Moisturizer.png",
    featured: true,
    stock: 60,
    description:
      "Rich ceramide-infused moisturizer that restores and strengthens your skin barrier.",
  },
  {
    name: "Oil-Free Matte Moisturizer",
    brand: "GLOW UP",
    category: "moisturizers",
    price: 52,
    oldPrice: null,
    badge: "New",
    rating: 4,
    image: "/backend/public/images/Repair Face Moisturizer_.png",
    featured: true,
    stock: 90,
    description:
      "Lightweight gel moisturizer that controls shine without clogging pores.",
  },
  {
    name: "Gentle Foam Cleanser",
    brand: "GLOW UP",
    category: "cleansers",
    price: 32,
    oldPrice: null,
    badge: null,
    rating: 5,
    image: "/backend/public/images/gentle foam cleanser.png",
    featured: false,
    stock: 150,
    description:
      "pH-balanced foaming cleanser that removes impurities without stripping skin.",
  },
  {
    name: "Micellar Cleansing Water",
    brand: "GLOW UP",
    category: "cleansers",
    price: 26,
    oldPrice: 34,
    badge: "Sale",
    rating: 4,
    image: "/backend/public/images/Micellar Cleansing Water.png",
    featured: false,
    stock: 200,
    description:
      "No-rinse micellar water that gently dissolves makeup and cleanses skin.",
  },
  {
    name: "SPF 50+ Daily Sunscreen",
    brand: "GLOW UP",
    category: "sunscreen",
    price: 38,
    oldPrice: null,
    badge: "Must-Have",
    rating: 5,
    image: "/backend/public/images/sunscreen.png",
    featured: false,
    stock: 110,
    description:
      "Lightweight, invisible SPF 50+ sunscreen with antioxidant protection.",
  },
  {
    name: "Retinol Renewal Night Serum",
    brand: "GLOW UP",
    category: "serums",
    price: 72,
    oldPrice: null,
    badge: "New",
    rating: 5,
    image: "/backend/public/images/Retinol Renewal Night Serum.png",
    featured: false,
    stock: 45,
    description:
      "0.3% encapsulated retinol serum for anti-aging and cell renewal while you sleep.",
  },
  {
    name: "Eye Contour Repair Gel",
    brand: "GLOW UP",
    category: "eyecare",
    price: 44,
    oldPrice: null,
    badge: null,
    rating: 4,
    image: "/backend/public/images/Eye Contour Repair Gel.png",
    featured: false,
    stock: 70,
    description:
      "Caffeine & peptide eye gel that targets puffiness, dark circles, and fine lines.",
  },
  {
    name: "Kaolin Clay Detox Mask",
    brand: "GLOW UP",
    category: "masks",
    price: 36,
    oldPrice: 48,
    badge: "Sale",
    rating: 4,
    image: "/backend/public/images/Kaolin Clay Detox Mask.png",
    featured: false,
    stock: 85,
    description:
      "Deep-cleansing kaolin clay mask that draws out impurities and minimizes pores.",
  },
  {
    name: "Niacinamide Pore Refiner",
    brand: "GLOW UP",
    category: "serums",
    price: 42,
    oldPrice: null,
    badge: null,
    rating: 5,
    image: "/backend/public/images/Niacinamide Pore Refiner.png",
    featured: false,
    stock: 130,
    description:
      "10% niacinamide + 1% zinc serum that reduces pore size and controls sebum.",
  },
  {
    name: "Peptide Anti-Aging Cream",
    brand: "GLOW UP",
    category: "moisturizers",
    price: 88,
    oldPrice: null,
    badge: "Premium",
    rating: 5,
    image: "/backend/public/images/Peptide Anti-Aging Cream.png",
    featured: false,
    stock: 35,
    description:
      "Luxury peptide complex cream that visibly firms, plumps, and reduces wrinkles.",
  },
];

const seed = async () => {
  await connectDB();
  try {
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");
    const inserted = await Product.insertMany(products);
    console.log(`✅  Seeded ${inserted.length} products successfully`);
  } catch (err) {
    console.error("❌  Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌  Disconnected from MongoDB");
  }
};

seed();
