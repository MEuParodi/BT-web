
"use strict";

document.querySelector(".iconoMenu").addEventListener("click", toggleMenu);

function toggleMenu() {
    document.querySelector("nav").classList.toggle("show");
}