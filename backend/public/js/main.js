// js/main.js — GLOW UP Homepage (API version)
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("featuredProducts");
  if (!container) return;

  container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted)">Loading... ✨</div>`;

  const products = await loadFeaturedProducts();
  container.innerHTML = products.length
    ? products.map(buildProductCard).join("")
    : `<p style="grid-column:1/-1;text-align:center">No featured products found.</p>`;
});
