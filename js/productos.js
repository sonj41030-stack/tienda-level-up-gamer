// ==========================================
// productos.js - Modulo de listado y filtrado de productos
// Renderiza el catalogo y gestiona la logica de productos
// Autor: Edixon Jhonaiker
// ==========================================


document.addEventListener("DOMContentLoaded", function () {

    const parametros = new URLSearchParams(window.location.search);

    const categoria = parametros.get("categoria");

    const productos = document.querySelectorAll(".product-card");

    const titulo = document.getElementById("titulo-productos");

    const subtitulo = document.getElementById("subtitulo-productos");

    const sinProductos = document.getElementById("sin-productos");


    // Si entramos desde "Productos", mostramos todo
    if (!categoria) {

        productos.forEach(function (producto) {

            producto.style.display = "";

        });

        return;
    }


    let cantidad = 0;


    productos.forEach(function (producto) {

        const categoriaProducto = producto
            .querySelector(".product-category")
            .textContent
            .trim()
            .toUpperCase();


        let mostrar = false;


        // CONSOLAS
        if (categoria === "consolas") {

            mostrar =
                categoriaProducto === "CONSOLAS";

        }


        // PC GAMER
        else if (categoria === "pc") {

            mostrar =
                categoriaProducto === "COMPUTADORES GAMERS";

        }


        // ACCESORIOS
        else if (categoria === "accesorios") {

            mostrar =
                categoriaProducto === "ACCESORIOS" ||
                categoriaProducto === "MOUSE" ||
                categoriaProducto === "MOUSEPAD";

        }


        // SILLAS GAMER
        else if (categoria === "sillas") {

            mostrar =
                categoriaProducto === "SILLAS GAMER";

        }


        if (mostrar) {

            producto.style.display = "";

            cantidad++;

        } else {

            producto.style.display = "none";

        }

    });


    // Cambiar título

    if (subtitulo) {

        subtitulo.textContent = "CATEGORÍA";

    }


    if (titulo) {

        if (categoria === "consolas") {

            titulo.innerHTML =
                'PRODUCTOS <span>CONSOLAS</span>';

        }

        else if (categoria === "pc") {

            titulo.innerHTML =
                'PRODUCTOS <span>PC GAMER</span>';

        }

        else if (categoria === "accesorios") {

            titulo.innerHTML =
                'PRODUCTOS <span>ACCESORIOS</span>';

        }

        else if (categoria === "sillas") {

            titulo.innerHTML =
                'PRODUCTOS <span>SILLAS GAMER</span>';

        }

    }


    // Si no encuentra nada

    if (sinProductos) {

        if (cantidad === 0) {

            sinProductos.style.display = "block";

        } else {

            sinProductos.style.display = "none";

        }

    }

});