let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// AGREGAR PRODUCTO
function agregarAlCarrito(codigo, nombre, precio) {

    precio = Number(precio);

    let producto = carrito.find(function(producto) {
        return producto.codigo === codigo;
    });

    if (producto) {
        producto.cantidad++;
    } else {
        carrito.push({
            codigo: codigo,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    guardarCarrito();

    alert("Producto agregado al carrito");

    actualizarContador();
}


// GUARDAR CARRITO
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}


// ACTUALIZAR CONTADOR
function actualizarContador() {

    let contador = document.getElementById("contador-carrito");

    if (!contador) {
        return;
    }

    let cantidad = 0;

    carrito.forEach(function(producto) {
        cantidad += producto.cantidad;
    });

    contador.textContent = cantidad;
}


// AUMENTAR CANTIDAD
function aumentarCantidad(codigo) {

    let producto = carrito.find(function(producto) {
        return producto.codigo === codigo;
    });

    if (producto) {
        producto.cantidad++;
    }

    guardarCarrito();
    mostrarCarrito();
    actualizarContador();
}


// DISMINUIR CANTIDAD
function disminuirCantidad(codigo) {

    let producto = carrito.find(function(producto) {
        return producto.codigo === codigo;
    });

    if (!producto) {
        return;
    }

    if (producto.cantidad > 1) {
        producto.cantidad--;
    } else {
        eliminarProducto(codigo);
        return;
    }

    guardarCarrito();
    mostrarCarrito();
    actualizarContador();
}


// ELIMINAR PRODUCTO
function eliminarProducto(codigo) {

    carrito = carrito.filter(function(producto) {
        return producto.codigo !== codigo;
    });

    guardarCarrito();
    mostrarCarrito();
    actualizarContador();
}


// VACIAR CARRITO
function vaciarCarrito() {

    if (carrito.length === 0) {
        return;
    }

    let confirmar = confirm("¿Quieres vaciar el carrito?");

    if (confirmar) {
        carrito = [];

        guardarCarrito();
        mostrarCarrito();
        actualizarContador();
    }
}


// MOSTRAR CARRITO
function mostrarCarrito() {

    let lista = document.getElementById("lista-carrito");
    let total = document.getElementById("total-carrito");

    if (!lista || !total) {
        return;
    }

    lista.innerHTML = "";

    let totalCompra = 0;

    if (carrito.length === 0) {

        lista.innerHTML = `
            <div class="carrito-vacio">
                <h3>🛒 Tu carrito está vacío</h3>
                <p>Agrega productos para comenzar tu compra.</p>
                <a href="productos.html">Ver productos</a>
            </div>
        `;

        total.textContent = "Total: $0";

        return;
    }


    carrito.forEach(function(producto) {

        let subtotal = producto.precio * producto.cantidad;

        totalCompra += subtotal;

        lista.innerHTML += `
            <div class="carrito-producto">

                <div class="carrito-info">

                    <h3>${producto.nombre}</h3>

                    <p>
                        Código: ${producto.codigo}
                    </p>

                    <p>
                        Precio unitario:
                        $${producto.precio.toLocaleString("es-CL")}
                    </p>

                </div>


                <div class="cantidad-control">

                    <button
                        class="btn-cantidad"
                        onclick="disminuirCantidad('${producto.codigo}')">
                        −
                    </button>

                    <span>
                        ${producto.cantidad}
                    </span>

                    <button
                        class="btn-cantidad"
                        onclick="aumentarCantidad('${producto.codigo}')">
                        +
                    </button>

                </div>


                <div class="carrito-subtotal">

                    <p>Subtotal</p>

                    <strong>
                        $${subtotal.toLocaleString("es-CL")}
                    </strong>

                </div>


                <button
                    class="btn-eliminar"
                    onclick="eliminarProducto('${producto.codigo}')">

                    🗑️ Eliminar

                </button>

            </div>
        `;
    });


    total.innerHTML = `
        Total:
        $${totalCompra.toLocaleString("es-CL")}
    `;


    lista.innerHTML += `
        <div class="acciones-carrito">

            <button
                class="btn-vaciar"
                onclick="vaciarCarrito()">

                🗑️ Vaciar carrito

            </button>

            <button
                class="btn-comprar"
                onclick="finalizarCompra()">

                💳 Finalizar compra

            </button>

        </div>
    `;
}


// FINALIZAR COMPRA
function finalizarCompra() {

    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    alert("¡Compra realizada correctamente!");

    carrito = [];

    guardarCarrito();
    mostrarCarrito();
    actualizarContador();
}


// CARGAR CARRITO AL ABRIR LA PÁGINA
document.addEventListener("DOMContentLoaded", function() {

    actualizarContador();

    mostrarCarrito();

});