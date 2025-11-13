"use strict";

// SECCIÓN DE QUERY-SELECTOR
// Éstos son los elementos que nos traemos de la página HTML y usamos en el código

const products_list = document.querySelector(".products_list");

const cart_box = document.querySelector(".cart_box");
const search_row = document.querySelector(".search-row");

//Seleccionar carrito y la lista

const cartBox = document.querySelector(".cartBox");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");

let products = []; //se llenará con el Fetch

// Normaliza texto (para filtrar sin tildes)
const normalize = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

//FETCH
// --- Traer todos los productos de la API ---
//Esta es la función que llama a la API Y nos devuelve products
const getProducts = async () => {
  const response = await fetch("https://fakestoreapi.com/products");

  // Le hemos quitado la constante ahora es una variable que se puede usar en todo el fichero porque esta ya el Let mas arriba creado
  products = await response.json();
  return products;
};

// --- Ejemplo de uso hemos llamado a get products ---
getProducts().then((products) => {
  // llamamos y despuiés lo logeamos, Aquí ya tengo el array de ptos disponible
  //console.log("Productos recibidos:", products);
});

const renderProductCards = (products) => {
  products_list.innerHTML = products
    .map(
      (p) => `
        <div class="product-item" ${p.id}">
          <img src="${p.image}" alt="${p.title}">
          <h3>${p.title}</h3>
          <p>$${p.price}</p>
          <button class="btn-buy" data-id="${p.id}">Comprar</button>
        </div>
      `
    )
    .join("");
};

//aqui estamos llamando a las funciones.

getProducts().then((products) => {
  //console.log(products); // <-- console log
  renderProductCards(products);

  //con eso la llamamos para que la haga
  addBuyButtonsEvents();
});

// SECCIÓN DE EVENTOS
// Éstos son los eventos a los que reacciona la página
// Los más comunes son: click (en botones, enlaces), input (en ídem) y submit (en form)

//Boton de buscar

function searchRow() {
  const q = normalize(searchInput.value.trim());

  const filtered = q
    ? products.filter((p) => normalize(p.title).includes(q))
    : products;

  renderProductCards(filtered);
}

//Para que lo escuche cuando usuario haga el click. y entonces lance el código que está dentro de search row

document.querySelector(".search-row").addEventListener("click", searchRow);

//Array donde guardamos lo añadido
let product_ids = [];

//Función: añadir producto al carrito

//aqui cogemos los products que ya tenemos del API y definimos una nueva contstante
//donde incluimos nuevos ids que ya tenemos
function addProductToCart(productId) {
  product_ids.push(Number(productId)); // añadimos el id
  const products_in_cart = products.filter((product) =>
    product_ids.includes(product.id)
  );
  console.log(products_in_cart);
  renderCart(); // repintamos el carrito
}

//Función enganchar botones “Comprar”

function addBuyButtonsEvents() {
  const buttons = document.querySelectorAll(".btn-buy");

  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      console.log(product_ids, "product_ids");

      console.log(e.target.dataset.id);
      addProductToCart(e.target.dataset.id);
      console.log(product_ids, "product_ids");
    });
  });
}

//Pintar el carrito
function renderCart() {
  cartList.innerHTML = "";
  let total = 0;

  // contar cantidades
  const counts = {};
  product_ids.forEach((id) => {
    counts[id] = (counts[id] || 0) + 1;
  });

  // recorrer los ids únicos
  Object.entries(counts).forEach(([id, qty]) => {
    const product = products.find((p) => p.id === Number(id));

    const item = document.createElement("div");
    item.className = "cart-item";
    item.innerHTML = `
      <span>${product.title} (x${qty})</span>
      <strong>$${(product.price * qty).toFixed(2)}</strong>
    `;

    cartList.appendChild(item);
    total += product.price * qty;
  });

  cartTotal.textContent = `$${total.toFixed(2)}`;
}
