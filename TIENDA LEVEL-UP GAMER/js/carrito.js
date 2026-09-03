let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


// Agregar producto al carrito
function agregarAlCarrito(codigo, nombre, precio) {

    let producto = carrito.find(p => p.codigo === codigo);

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

    localStorage.setItem("carrito", JSON.stringify(carrito));

    actualizarContador();

    alert("Producto agregado al carrito");
}


// Actualizar número del carrito
function actualizarContador() {

    let contador = document.getElementById("contador-carrito");

    if (contador) {

        let cantidad = 0;

        carrito.forEach(producto => {
            cantidad += producto.cantidad;
        });

        contador.textContent = cantidad;
    }
}


// Mostrar productos del carrito
function mostrarCarrito() {

    let lista = document.getElementById("lista-carrito");
    let total = document.getElementById("total-carrito");

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    let totalCompra = 0;


    if (carrito.length === 0) {

        lista.innerHTML = `
            <p style="text-align:center; color:#D3D3D3;">
                El carrito está vacío.
            </p>
        `;

        total.textContent = "Total: $0";

        return;
    }


    carrito.forEach(producto => {

        let subtotal =
            producto.precio * producto.cantidad;

        totalCompra += subtotal;


        lista.innerHTML += `

            <div class="product-card">

                <div class="product-info">

                    <h3>${producto.nombre}</h3>

                    <p>
                        Cantidad: ${producto.cantidad}
                    </p>

                    <p class="price">
                        $${subtotal.toLocaleString("es-CL")}
                    </p>

                </div>

            </div>

        `;
    });


    total.textContent =
        "Total: $" +
        totalCompra.toLocaleString("es-CL");
}


// Ejecutar cuando carga la página
document.addEventListener("DOMContentLoaded", function() {

    actualizarContador();
    mostrarCarrito();

});