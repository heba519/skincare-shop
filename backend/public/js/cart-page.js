// js/cart-page.js — GLOW UP Cart Page (API version)
let promoApplied = false;
let discountPercent = 0;

document.addEventListener("DOMContentLoaded", async () => {
  // Load products first so PRODUCTS cache is populated
  await loadProducts();
  renderCartPage();
});

function renderCartPage() {
  const cart = getCart();
  const listEl = document.getElementById("cartItemsList");
  const emptyEl = document.getElementById("cartEmpty");
  const summaryEl = document.getElementById("cartSummary");
  if (!listEl) return;

  if (cart.length === 0) {
    listEl.innerHTML = "";
    if (emptyEl) emptyEl.style.display = "block";
    if (summaryEl) summaryEl.style.display = "none";
    return;
  }
  if (emptyEl) emptyEl.style.display = "none";
  if (summaryEl) summaryEl.style.display = "block";

  listEl.innerHTML = cart
    .map((item) => {
      const p = PRODUCTS.find((p) => (p._id || p.id) === item.id);
      if (!p) return "";
      const pid = p._id || p.id;
      return `
      <div class="cart-item" id="ci-${pid}">
        <img class="cart-item-img" src="${p.image}" alt="${p.name}" />
        <div class="cart-item-info">
          <p class="cart-item-brand">${p.brand}</p>
          <p class="cart-item-name">${p.name}</p>
          <p class="cart-item-price">$${p.price.toFixed(2)}</p>
          <div class="qty-controls">
            <button class="qty-btn" onclick="changeQty('${pid}',-1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${pid}',1)">+</button>
          </div>
        </div>
        <button class="remove-btn" onclick="deleteItem('${pid}')">✕</button>
      </div>`;
    })
    .join("");

  updateSummary();
}

function changeQty(id, delta) {
  updateQty(id, delta);
  renderCartPage();
}

function deleteItem(id) {
  const el = document.getElementById(`ci-${id}`);
  if (el) {
    el.style.transition = "all 0.3s";
    el.style.opacity = "0";
    el.style.transform = "translateX(30px)";
    setTimeout(() => {
      removeFromCart(id);
      renderCartPage();
    }, 280);
  }
}

function updateSummary() {
  const sub = getCartTotal();
  const ship = sub >= 50 ? 0 : 5.99;
  const disc = promoApplied ? (sub * discountPercent) / 100 : 0;
  const total = sub - disc + ship;
  const s = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  };
  s("summarySubtotal", `$${sub.toFixed(2)}`);
  s("summaryShipping", ship === 0 ? "Free 🎉" : `$${ship.toFixed(2)}`);
  s("summaryTotal", `$${total.toFixed(2)}`);
  s("discountVal", `-$${disc.toFixed(2)}`);
  const dl = document.getElementById("discountLine");
  if (dl) dl.style.display = promoApplied ? "flex" : "none";
}

function applyPromo() {
  const code = (document.getElementById("promoInput")?.value || "")
    .trim()
    .toUpperCase();
  const codes = { GLOW10: 10, SKIN20: 20, GLOW15: 15 };
  if (codes[code]) {
    discountPercent = codes[code];
    promoApplied = true;
    showToast(`🎉 ${discountPercent}% discount applied!`);
    updateSummary();
  } else {
    showToast("❌ Invalid promo code");
  }
}

// ─── Checkout → sends cart to backend ────────────────────────────────────────
async function checkout() {
  const cart = getCart();
  if (cart.length === 0) return;

  const promoCode = promoApplied
    ? (document.getElementById("promoInput")?.value || "").trim().toUpperCase()
    : null;

  const body = {
    items: cart.map((i) => ({ productId: i.id, qty: i.qty })),
    promoCode,
    customerInfo: { name: "Guest", email: "guest@example.com" }, // replace with real form later
  };

  try {
    const res = await fetch("http://localhost:5000/api/orders/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (data.success) {
      showToast("🎉 Order placed successfully!");
      localStorage.removeItem("glowup_cart");
      setTimeout(() => {
        renderCartPage();
        updateCartCount();
      }, 800);
    } else {
      showToast(`❌ ${data.message}`);
    }
  } catch (err) {
    showToast("❌ Could not connect to server");
    console.error(err);
  }
}
