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

//Funcion para aplicar filtro
//BUSCAR
