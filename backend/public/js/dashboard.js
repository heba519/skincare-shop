let products = [];
let categories = [];
let currentProductId = null;

/* ================= PRODUCTS ================= */

async function loadProducts() {
  const res = await fetch("/api/products");
  const data = await res.json();

  products = data.products;

  renderProducts();
}

function renderProducts() {
  const table = document.getElementById("productTable");
  table.innerHTML = "";

  products.forEach((p) => {
    table.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.price}</td>
        <td>${p.category?.name || "N/A"}</td>
        <td>
          <button class="edit" onclick="editProduct('${p._id}')">Edit</button>
          <button onclick="deleteProduct('${p._id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

function showAddForm() {
  currentProductId = null;

  document.getElementById("name").value = "";
  document.getElementById("price").value = "";

  document.getElementById("productForm").style.display = "block";
}

/* ADD PRODUCT */
async function addProduct() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;

  // مؤقتًا هنحط values ثابتة لحد ما نربط UI
  const category = "PUT_CATEGORY_ID_HERE";
  const image = "/images/default.png";

  await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      price,
      category,
      image,
    }),
  });

  loadProducts();
}
/* EDIT PRODUCT */
async function editProduct(id) {
  const res = await fetch(`/api/products/${id}`);
  const product = await res.json();

  currentProductId = id;

  document.getElementById("name").value = product.name;
  document.getElementById("price").value = product.price;

  document.getElementById("productForm").style.display = "block";
}

/* UPDATE PRODUCT */
async function updateProduct() {
  if (!currentProductId) return;

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;

  await fetch(`/api/products/${currentProductId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, price }),
  });

  currentProductId = null;

  document.getElementById("productForm").style.display = "none";

  loadProducts();
}

/* DELETE PRODUCT */
async function deleteProduct(id) {
  await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });

  loadProducts();
}

/* ================= CATEGORIES ================= */

async function loadCategories() {
  const res = await fetch("/api/categories");
  const data = await res.json();

  categories = data;
  renderCategories();
}

function renderCategories() {
  const table = document.getElementById("categoryTable");
  table.innerHTML = "";

  categories.forEach((c) => {
    table.innerHTML += `
      <tr>
        <td>${c.name}</td>
        <td>
          <button onclick="deleteCategory('${c._id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

/* ADD CATEGORY */
async function addCategory() {
  const name = prompt("Category name:");

  if (!name) return;

  await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  loadCategories();
}

/* DELETE CATEGORY */
async function deleteCategory(id) {
  await fetch(`/api/categories/${id}`, {
    method: "DELETE",
  });

  loadCategories();
}

/* ================= INIT ================= */

loadProducts();
loadCategories();
