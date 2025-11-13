"use strict";

// SECCIÓN DE QUERY-SELECTOR
// Éstos son los elementos que nos traemos de la página HTML y usamos en el código

const products_list = document.querySelector(".products_list");

const cart_box = document.querySelector(".cart_box");
const search_row = document.querySelector(".search-row");

let products = []; //se llenará con el Fetch

// Normaliza texto (para filtrar sin tildes)
const normalize = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

// Ahora hacer EL FETCH A la API

// --- Función para mostrar los productos ---

// Escucha el input para filtrar

// --- Traer todos los productos de la API ---
//Esta es la función que llama a la API Y nos devuelve products
const getProducts = async () => {
  const response = await fetch("https://fakestoreapi.com/products");

  // Le hemos quitado la constante ahora es una variable que se puede usar en todo el fichero porque sta ya el Let mas arriba creado
  products = await response.json(); // ← aquí obtienes el array completo
  console.log(products); // Muestra el array completo en consola
  return products;
};

// --- Ejemplo de uso hemos llamado a get products ---
getProducts().then((products) => {
  // llamamos y despuiés lo logeamos, Aquí ya tengo el array de ptos disponible

  console.log("Productos recibidos:", products);
});

// Esta es una funcion que coge products y para cada producto vamos a mapear los datos en el HTML para crear una tarjeta
//Esta constante va al HTML selecciona la clase products_list y la llamamos container.
//Y decimos vamos a llamar container a ese div. Decimos coge container y adentro de su HTML vamos a coger los products que hemos pasado
//a esta funcion y ahora los productos que es un array de objetos, tenemos que hacer algo.  cada uno de los objetos
//por eso cogemos los productos y decimos vamos a inyectar al container un div
//con clase product item para cada uno de los productos
// lo interpolamos en esa estructura de tarjeta que hemos creado.

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
  console.log(products); // <-- console log
  renderProductCards(products);
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

// SECCIÓN DE ACCIONES AL CARGAR LA PÁGINA
// Este código se ejecutará cuando se carga la página
// Lo más común es:
//   - Pedir datos al servidor
//   - Pintar (render) elementos en la página

console.log("Página y JS cargados!");
