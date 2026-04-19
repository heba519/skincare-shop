// js/products.js — GLOW UP Products Page
// Self-contained: no dependency on products-data.js

const API_BASE = "http://localhost:5000/api";

// Global PRODUCTS cache (cart.js reads this too)
let PRODUCTS = [];
let activeCategory = "all";
let maxPrice = 200;
let sortOrder = "default";

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

async function fetchProducts(queryString = "") {
  const res = await fetch(`${API_BASE}/products${queryString}`);
  const data = await res.json();
  PRODUCTS = data.products || [];
  return PRODUCTS;
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("cat");
  if (cat) {
    activeCategory = cat;
    setActive(cat);
    setTitle(cat);
  }

  await renderProducts();

  document.querySelectorAll(".pill[data-cat]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      activeCategory = btn.dataset.cat;
      setActive(activeCategory);
      setTitle(activeCategory);
      await renderProducts();
    });
  });

  const slider = document.getElementById("priceRange");
  if (slider)
    slider.addEventListener("input", async () => {
      maxPrice = parseInt(slider.value);
      document.getElementById("priceVal").textContent = `$${maxPrice}`;
      await renderProducts();
    });

  const sortSel = document.getElementById("sortSelect");
  if (sortSel)
    sortSel.addEventListener("change", async () => {
      sortOrder = sortSel.value;
      await renderProducts();
    });
});

function setActive(cat) {
  document
    .querySelectorAll(".pill[data-cat]")
    .forEach((b) => b.classList.toggle("active", b.dataset.cat === cat));
}

function setTitle(cat) {
  const map = {
    all: "All Products",
    serums: "Serums 🧴",
    moisturizers: "Moisturizers 🫧",
    cleansers: "Cleansers 🫙",
    sunscreen: "SPF & Sunscreen ☀️",
    eyecare: "Eye Care 👁️",
    masks: "Masks 🍃",
  };
  const el = document.getElementById("pageTitle");
  if (el) el.textContent = map[cat] || "All Products";
}

async function renderProducts() {
  const grid = document.getElementById("productsGrid");
  const count = document.getElementById("resultsCount");
  if (!grid) return;

  grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--muted)">Loading... ✨</div>`;

  try {
    const qp = new URLSearchParams();
    if (activeCategory !== "all") qp.set("category", activeCategory);
    if (maxPrice < 200) qp.set("maxPrice", maxPrice);
    if (sortOrder !== "default") qp.set("sort", sortOrder);

    const list = await fetchProducts(`?${qp.toString()}`);

    if (count)
      count.textContent = `Showing ${list.length} product${list.length !== 1 ? "s" : ""}`;

    grid.innerHTML = list.length
      ? list.map(buildProductCard).join("")
      : `<div style="grid-column:1/-1;text-align:center;padding:80px;color:var(--muted);font-size:18px;font-weight:700">😕 No products found.</div>`;
  } catch (err) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:#ef4444;font-weight:700">❌ Could not load products. Is the server running?</div>`;
    console.error("Products fetch error:", err);
  }
}
