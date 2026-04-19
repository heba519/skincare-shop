// js/cart.js — GLOW UP Cart Logic (API version)
// Cart items stored locally, checkout sends to backend

function getCart() {
  return JSON.parse(localStorage.getItem("glowup_cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("glowup_cart", JSON.stringify(cart));
  updateCartCount();
}

// productId is now a MongoDB _id string
function addToCart(productId) {
  const cart = getCart();
  // Find product in cached PRODUCTS array
  const product = PRODUCTS.find((p) => (p._id || p.id) === productId);
  const existing = cart.find((i) => i.id === productId);
  if (existing) existing.qty += 1;
  else cart.push({ id: productId, qty: 1 });
  saveCart(cart);
  const name = product ? product.name : "Item";
  showToast(`${name} added! 🛒`);
}

function removeFromCart(productId) {
  saveCart(getCart().filter((i) => i.id !== productId));
}

function updateQty(productId, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart(cart);
}

function getCartTotal() {
  return getCart().reduce((t, i) => {
    const p = PRODUCTS.find((p) => (p._id || p.id) === i.id);
    return t + (p ? p.price * i.qty : 0);
  }, 0);
}

function getCartItemCount() {
  return getCart().reduce((c, i) => c + i.qty, 0);
}

function updateCartCount() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;
  const count = getCartItemCount();
  badge.textContent = count;
  badge.style.display = count === 0 ? "none" : "flex";
}

function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg || "Added! ✓";
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

document.addEventListener("DOMContentLoaded", updateCartCount);
