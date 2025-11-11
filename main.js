// ===============================================
// VARIABLES GLOBALES Y CONSTANTES
// ===============================================
const API_URL = "https://fakestoreapi.com/products";
const LS_CART_KEY = "tienda_carrito_local_v1";

let allProducts = [];
let filteredProducts = [];
let cart = [];

// Referencias a elementos del DOM
const resultsGridEl = document.getElementById("resultsGrid");
const searchBtnEl = document.getElementById("searchBtn");
const searchInputEl = document.getElementById("searchInput");
const cartListEl = document.getElementById("cartList");
const cartTotalEl = document.getElementById("cartTotal");
const clearCartBtnEl = document.getElementById("clearCartBtn");

// ===============================================
// FUNCIONES DE LOCALSTORAGE
// ===============================================
function loadCartFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LS_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveCartToLocalStorage() {
  localStorage.setItem(LS_CART_KEY, JSON.stringify(cart));
}

// ===============================================
// FUNCIÓN PARA OBTENER PRODUCTOS DE LA API
// ===============================================
async function fetchProducts() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    allProducts = Array.isArray(data) ? data : [];
    filteredProducts = allProducts.slice();
    renderResults(filteredProducts);
  } catch {
    resultsGridEl.innerHTML = "<p>Error al cargar los productos.</p>";
  }
}

// ===============================================
// FUNCIÓN PARA MOSTRAR LOS PRODUCTOS
// ===============================================
function renderResults(products) {
  if (!products.length) {
    resultsGridEl.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }

  const html = products
    .map((p) => {
      const inCart = cart.some((c) => c.id === p.id);
      const imageSrc = p.image
        ? p.image
        : "https://placehold.co/600x400?text=Sin+Imagen";
      const btnClass = inCart ? "btn in-cart" : "btn";
      const btnLabel = inCart ? "Eliminar" : "Comprar";

      return `
      <article class="card" data-id="${p.id}">
        <div class="card-media">
          <img src="${imageSrc}" alt="${p.title || "Producto"}" />
        </div>
        <div class="card-body">
          <h3 class="card-title">${p.title}</h3>
          <p class="card-price">$${p.price.toFixed(2)}</p>
          <button class="${btnClass}" data-action="toggle-cart">${btnLabel}</button>
        </div>
      </article>
    `;
    })
    .join("");

  resultsGridEl.innerHTML = html;
}

// ===============================================
// FUNCIÓN PARA MOSTRAR EL CARRITO
// ===============================================
function renderCart() {
  if (!cart.length) {
    cartListEl.innerHTML = "<p>El carrito está vacío.</p>";
    cartTotalEl.textContent = "$0.00";
    return;
  }

  const html = cart
    .map(
      (item) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <span class="cart-item-title">${item.title}</span>
        <span class="cart-item-qty">x${item.qty}</span>
      </div>
      <div class="cart-item-right">
        <span class="cart-item-price">$${(item.price * item.qty).toFixed(
          2
        )}</span>
        <button class="cart-remove" data-remove="${
          item.id
        }" title="Eliminar">×</button>
      </div>
    </div>
  `
    )
    .join("");

  cartListEl.innerHTML = html;
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  cartTotalEl.textContent = `$${total.toFixed(2)}`;
}

// ===============================================
// FUNCIONES PARA GESTIONAR EL CARRITO
// ===============================================
function toggleCart(product) {
  const exists = cart.find((i) => i.id === product.id);
  if (exists) removeFromCart(product.id);
  else addToCart(product);
}

function addToCart(product) {
  const found = cart.find((i) => i.id === product.id);
  if (found) found.qty += 1;
  else
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      qty: 1,
    });
  saveCartToLocalStorage();
  renderCart();
  renderResults(filteredProducts);
}

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCartToLocalStorage();
  renderCart();
  renderResults(filteredProducts);
}

// ===============================================
// EVENTOS
// ===============================================
// Botón de búsqueda
searchBtnEl.addEventListener("click", () => {
  const query = searchInputEl.value.toLowerCase().trim();
  filteredProducts = allProducts.filter((p) =>
    p.title.toLowerCase().includes(query)
  );
  renderResults(filteredProducts);
});

// Botón de comprar/eliminar en tarjetas
resultsGridEl.addEventListener("click", (e) => {
  const btn = e.target.closest('button[data-action="toggle-cart"]');
  if (!btn) return;
  const card = e.target.closest(".card");
  const id = Number(card.dataset.id);
  const product = allProducts.find((p) => p.id === id);
  toggleCart(product);
});

// Eliminar desde el carrito
cartListEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-remove]");
  if (!btn) return;
  const id = Number(btn.dataset.remove);
  removeFromCart(id);
});

// Vaciar carrito completo
clearCartBtnEl.addEventListener("click", () => {
  cart = [];
  saveCartToLocalStorage();
  renderCart();
  renderResults(filteredProducts);
});

// ===============================================
// INICIALIZACIÓN
// ===============================================
function init() {
  cart = loadCartFromLocalStorage();
  renderCart();
  fetchProducts();
}

init();
