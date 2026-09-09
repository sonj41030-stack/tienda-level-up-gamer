document.addEventListener('DOMContentLoaded', () => {
    const contenedorCarrito = document.getElementById('cart-content');
    const totalElemento = document.getElementById('cart-total');
    const btnVaciar = document.getElementById('btn-vaciar');
    const btnComprar = document.getElementById('btn-comprar');

    function renderizarCarrito() {
        if (!contenedorCarrito) return;

        let carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
        contenedorCarrito.innerHTML = '';
        let total = 0;

        if (carritoActual.length === 0) {
            contenedorCarrito.innerHTML = '<p style="text-align:center; color:gray;">Tu carrito está vacío.</p>';
            if (totalElemento) totalElemento.textContent = '0';
            return;
        }

        carritoActual.forEach(producto => {
            const precioNumerico = typeof producto.precio === 'string' 
                ? parseInt(producto.precio.replace(/[^0-9]/g, ''), 10) 
                : producto.precio;

            const subtotal = precioNumerico * producto.cantidad;
            total += subtotal;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="item-info">
                    <h4>${producto.nombre}</h4>
                    <p>Cantidad: ${producto.cantidad} x $${precioNumerico.toLocaleString('es-CL')}</p>
                </div>
                <div class="item-subtotal">
                    <p style="font-weight:bold;">$${subtotal.toLocaleString('es-CL')}</p>
                </div>
            `;
            contenedorCarrito.appendChild(div);
        });

        if (totalElemento) {
            totalElemento.textContent = total.toLocaleString('es-CL');
        }
    }

    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => {
            localStorage.removeItem('carrito');
            renderizarCarrito();
            if (typeof actualizarContadorCarrito === 'function') {
                actualizarContadorCarrito();
            }
        });
    }

    if (btnComprar) {
        btnComprar.addEventListener('click', () => {
            let carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
            if (carritoActual.length > 0) {
                alert("¡Transacción exitosa! Gracias por tu compra en Level-Up Gamer.");
                localStorage.removeItem('carrito');
                window.location.href = '../index.html';
            } else {
                alert("Tu carrito está vacío. Agrega productos antes de intentar pagar.");
            }
        });
    }

    renderizarCarrito();
});