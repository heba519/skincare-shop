// controllers/orderController.js — Order / Checkout Logic

const Order = require("../models/Order");
const Product = require("../models/Product");

// Promo codes (move to DB later)
const PROMO_CODES = { GLOW10: 10, SKIN20: 20, GLOW15: 15 };

// ─── POST /api/orders/checkout ────────────────────────────────────────────────
const createOrder = async (req, res) => {
  try {
    const { items, promoCode, customerInfo } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Validate products & build order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({
            success: false,
            message: `Product ${item.productId} not found`,
          });
      }
      if (product.stock < item.qty) {
        return res
          .status(400)
          .json({
            success: false,
            message: `"${product.name}" is out of stock`,
          });
      }
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        qty: item.qty,
      });
      subtotal += product.price * item.qty;
    }

    // Discount
    let discount = 0;
    let appliedPromo = null;
    if (promoCode) {
      const pct = PROMO_CODES[promoCode.toUpperCase()];
      if (pct) {
        discount = (subtotal * pct) / 100;
        appliedPromo = promoCode.toUpperCase();
      }
    }

    const shipping = subtotal >= 50 ? 0 : 5.99;
    const total = subtotal - discount + shipping;

    // Save order
    const order = await Order.create({
      items: orderItems,
      subtotal,
      discount,
      shipping,
      total,
      promoCode: appliedPromo,
      customerInfo,
    });

    // Decrement stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.qty },
      });
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/orders ──────────────────────────────────────────────────────────
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/orders/:id ──────────────────────────────────────────────────────
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PATCH /api/orders/:id/status ────────────────────────────────────────────
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { createOrder, getAllOrders, getOrderById, updateOrderStatus };
