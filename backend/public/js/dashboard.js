let products = [];
let currentProductId = null;
//let categories = [];
/* ================= PRODUCTS ================= */

async function loadProducts() {
  const res = await fetch("/api/products");
  const data = await res.json();

  products = data.products;

  const table = document.getElementById("productTable");
  table.innerHTML = "";

  products.forEach((p) => {
    table.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.price}</td>
        <td>${p.category?.name || "—"}</td>
        <td>
          <button onclick="editProduct('${p._id}')">Edit</button>
          <button onclick="deleteProduct('${p._id}')">Delete</button>
        </td>
      </tr>
    `;
  });
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
  const product = {
    name: document.getElementById("name").value,
    price: document.getElementById("price").value,
    image: document.getElementById("image").value,
    category: document.getElementById("category").value,
  };

  await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  loadProducts();
}
/* EDIT PRODUCT */
async function editProduct(id) {
  const res = await fetch(`/api/products/${id}`);
  const data = await res.json();

  currentProductId = id;

  document.getElementById("name").value = data.product.name;
  document.getElementById("price").value = data.product.price;
  document.getElementById("image").value = data.product.image;
  document.getElementById("category").value = data.product.category._id;

  document.getElementById("productForm").style.display = "block";
}
/* UPDATE PRODUCT */
async function updateProduct() {
  const product = {
    name: document.getElementById("name").value,
    price: document.getElementById("price").value,
    image: document.getElementById("image").value,
    category: document.getElementById("category").value,
  };

  await fetch(`/api/products/${currentProductId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
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

async function loadCategoriesDropdown() {
  try {
    const res = await fetch("/api/categories");
    const data = await res.json();

    const select = document.getElementById("category");
    if (!select) return;

    select.innerHTML = "<option value=''>Select Category</option>";

    data.forEach((c) => {
      select.innerHTML += `
        <option value="${c._id}">
          ${c.name}
        </option>
      `;
    });
  } catch (err) {
    console.log(err);
  }
}

async function loadCategoriesTable() {
  try {
    const res = await fetch("/api/categories");
    const data = await res.json();

    const table = document.getElementById("categoryTable");
    if (!table) return;

    table.innerHTML = "";

    data.forEach((c) => {
      table.innerHTML += `
        <tr>
          <td>${c.name}</td>
          <td>
            <button onclick="editCategory('${c._id}', '${c.name}')">Edit</button>
            <button onclick="deleteCategory('${c._id}')">Delete</button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.log(err);
  }
}

/*function renderCategories() {
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
}*/

/* ADD CATEGORY */
async function addCategory() {
  const name = prompt("Enter category name:");

  if (!name) return;

  await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  await loadCategories();
}

//edit category
async function editCategory(id, oldName) {
  const newName = prompt("Edit category name:", oldName);

  if (!newName) return;

  await fetch(`/api/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: newName }),
  });

  loadCategoriesTable();
  loadCategoriesDropdown(); //
}

//api for update category
async function updateCategory(id, name) {
  await fetch(`/api/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  loadCategories();
}
/* DELETE CATEGORY */
async function deleteCategory(id) {
  try {
    await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    loadCategoriesTable();
    loadCategoriesDropdown();
  } catch (err) {
    console.log(err);
  }
}
/* ================= INIT ================= */

window.onload = () => {
  loadProducts();
  loadCategoriesDropdown();
  loadCategoriesTable();
};
