"use strict";

// SECCIÓN DE QUERY-SELECTOR
// Éstos son los elementos que nos traemos de la página HTML y usamos en el código

const products_list = document.querySelector(".products_list");

const cart_box = document.querySelector(".cart_box");
const search_row = document.querySelector(".search-row");

let productsList = []; //se llenará con el Fetch

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
  const products = await response.json(); // ← aquí obtienes el array completo
  console.log(products); // Muestra el array completo en consola
  return products;
};

// --- Ejemplo de uso hemos llamado a get products ---
getProducts().then((products) => {
  // llamamos y despuiés lo logeamos, Aquí ya tengo el array de ptos disponible

  console.log("Productos recibidos:", products);
});
