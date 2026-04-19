// GLOW UP — Products Data

/*const PRODUCTS = [
  { id:1,  name:"Vitamin C Brightening Serum",    brand:"GLOW UP", category:"serums",       price:58, oldPrice:null, badge:"Best Seller", rating:5, image:"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80", featured:true },
  { id:2,  name:"Hyaluronic Acid Deep Hydration",  brand:"GLOW UP", category:"serums",       price:46, oldPrice:62,   badge:"Sale",        rating:5, image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80", featured:true },
  { id:3,  name:"Barrier Repair Moisturizer",      brand:"GLOW UP", category:"moisturizers", price:64, oldPrice:null, badge:null,          rating:4, image:"https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=500&q=80", featured:true },
  { id:4,  name:"Oil-Free Matte Moisturizer",      brand:"GLOW UP", category:"moisturizers", price:52, oldPrice:null, badge:"New",         rating:4, image:"https://images.unsplash.com/photo-1585232352617-b8e03e6c4e39?w=500&q=80", featured:true },
  { id:5,  name:"Gentle Foam Cleanser",            brand:"GLOW UP", category:"cleansers",    price:32, oldPrice:null, badge:null,          rating:5, image:"https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500&q=80", featured:false },
  { id:6,  name:"Micellar Cleansing Water",        brand:"GLOW UP", category:"cleansers",    price:26, oldPrice:34,   badge:"Sale",        rating:4, image:"https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500&q=80", featured:false },
  { id:7,  name:"SPF 50+ Daily Sunscreen",         brand:"GLOW UP", category:"sunscreen",    price:38, oldPrice:null, badge:"Must-Have",   rating:5, image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80", featured:false },
  { id:8,  name:"Retinol Renewal Night Serum",     brand:"GLOW UP", category:"serums",       price:72, oldPrice:null, badge:"New",         rating:5, image:"https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=500&q=80", featured:false },
  { id:9,  name:"Eye Contour Repair Gel",          brand:"GLOW UP", category:"eyecare",      price:44, oldPrice:null, badge:null,          rating:4, image:"https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=500&q=80", featured:false },
  { id:10, name:"Kaolin Clay Detox Mask",          brand:"GLOW UP", category:"masks",        price:36, oldPrice:48,   badge:"Sale",        rating:4, image:"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80", featured:false },
  { id:11, name:"Niacinamide Pore Refiner",        brand:"GLOW UP", category:"serums",       price:42, oldPrice:null, badge:null,          rating:5, image:"https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&q=80", featured:false },
  { id:12, name:"Peptide Anti-Aging Cream",        brand:"GLOW UP", category:"moisturizers", price:88, oldPrice:null, badge:"Premium",     rating:5, image:"https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&q=80", featured:false },
];

const BADGE_CLASSES = {
  "Sale": "badge-sale",
  "New": "badge-new",
  "Best Seller": "badge-best",
  "Must-Have": "badge-musthave",
  "Premium": "badge-premium",
};

function renderStars(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function buildProductCard(p) {
  const badge = p.badge
    ? `<div class="product-badge ${BADGE_CLASSES[p.badge] || ''}">${p.badge}</div>` : '';
  const oldPrice = p.oldPrice
    ? `<span class="old-price">$${p.oldPrice}</span>` : '';
  return `
    <div class="product-card">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        ${badge}
        <button class="quick-add" onclick="addToCart(${p.id})">+ Add to Cart</button>
      </div>
      <div class="product-info">
        <p class="product-brand">${p.brand}</p>
        <p class="product-name">${p.name}</p>
        <div class="product-price-row">
          <p class="product-price">${oldPrice}$${p.price}</p>
          <span class="product-stars">${renderStars(p.rating)}</span>
        </div>
      </div>
    </div>`;
}
*/

// js/products-data.js — GLOW UP (API version)
// هنا بنجيب المنتجات من الـ Backend بدل ما تكون static

const API_BASE = "http://localhost:5000/api";

// ─── Helper: Fetch wrapper ────────────────────────────────────────────────────
async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// ─── Keep BADGE_CLASSES & helpers as before ───────────────────────────────────
const BADGE_CLASSES = {
  Sale: "badge-sale",
  New: "badge-new",
  "Best Seller": "badge-best",
  "Must-Have": "badge-musthave",
  Premium: "badge-premium",
};

function renderStars(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function buildProductCard(p) {
  // Support both MongoDB _id and legacy numeric id
  const pid = p._id || p.id;
  const badge = p.badge
    ? `<div class="product-badge ${BADGE_CLASSES[p.badge] || ""}">${p.badge}</div>`
    : "";
  const oldPrice = p.oldPrice
    ? `<span class="old-price">$${p.oldPrice}</span>`
    : "";
  return `
    <div class="product-card">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        ${badge}
        <button class="quick-add" onclick="addToCart('${pid}')">+ Add to Cart</button>
      </div>
      <div class="product-info">
        <p class="product-brand">${p.brand}</p>
        <p class="product-name">${p.name}</p>
        <div class="product-price-row">
          <p class="product-price">${oldPrice}$${p.price}</p>
          <span class="product-stars">${renderStars(p.rating)}</span>
        </div>
      </div>
    </div>`;
}

// ─── Global PRODUCTS cache (loaded async) ─────────────────────────────────────
let PRODUCTS = [];

async function loadProducts(params = "") {
  try {
    const data = await apiFetch(`/products${params}`);
    PRODUCTS = data.products;
    return PRODUCTS;
  } catch (err) {
    console.error("Failed to load products:", err);
    return [];
  }
}

async function loadFeaturedProducts() {
  try {
    const data = await apiFetch("/products/featured");
    return data.products;
  } catch (err) {
    console.error("Failed to load featured products:", err);
    return [];
  }
}
