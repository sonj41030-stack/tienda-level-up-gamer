document.addEventListener('DOMContentLoaded', () => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const actualizarContador = () => {
        const btnCarrito = document.querySelector('.cart-btn');
        if (btnCarrito) {
            const totalItems = carrito.reduce((total, producto) => total + producto.cantidad, 0);
            btnCarrito.textContent = `🛒 Cart (${totalItems})`;
        }
    };

    actualizarContador();

    const botonesAgregar = document.querySelectorAll('.product-card .btn-secondary');

    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            
            const tituloElemento = card.querySelector('h3, h4');
            const precioElemento = card.querySelector('.price');

            if (!tituloElemento || !precioElemento) {
                console.error("Error: No se encontró el título o el precio en esta tarjeta de producto.");
                return;
            }

            const nombre = tituloElemento.textContent.trim();
            const precio = precioElemento.textContent.trim();

            const productoExistente = carrito.find(item => item.nombre === nombre);

            if (productoExistente) {
                productoExistente.cantidad += 1;
            } else {
                carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
            }

            localStorage.setItem('carrito', JSON.stringify(carrito));
            actualizarContador();
            alert(`¡${nombre} se agregó al carrito!`);
        });
    });

    const cartBody = document.getElementById('cart-body');
    const cartTotal = document.getElementById('cart-total');
    const btnVaciar = document.getElementById('btn-vaciar');
    const btnPagar = document.getElementById('btn-pagar');

    if (cartBody) { 
        const renderizarCarrito = () => {
            cartBody.innerHTML = ''; 
            let totalPagar = 0;

            if (carrito.length === 0) {
                cartBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">Tu carrito está vacío.</td></tr>';
                cartTotal.textContent = '$0';
                return;
            }

            carrito.forEach(producto => {
                const precioNumerico = parseInt(producto.precio.replace(/[^0-9]/g, ''));
                const subtotal = precioNumerico * producto.cantidad;
                totalPagar += subtotal;

                const fila = document.createElement('tr');
                fila.style.borderBottom = '1px solid #333';
                fila.innerHTML = `
                    <td style="padding: 10px 0;">${producto.nombre}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.cantidad}</td>
                    <td style="color: var(--accent-green);">$${subtotal.toLocaleString('es-CL')}</td>
                `;
                cartBody.appendChild(fila);
            });

            cartTotal.textContent = `$${totalPagar.toLocaleString('es-CL')}`;
        };

        renderizarCarrito();

        if (btnVaciar) {
            btnVaciar.addEventListener('click', () => {
                if (confirm('¿Estás seguro de vaciar el carrito?')) {
                    carrito = [];
                    localStorage.removeItem('carrito');
                    actualizarContador();
                    renderizarCarrito();
                }
            });
        }

        if (btnPagar) {
            btnPagar.addEventListener('click', () => {
                if (carrito.length === 0) {
                    alert('Tu carrito está vacío. ¡Agrega algunos juegos primero!');
                    return;
                }
                alert('¡Pago realizado con éxito! Gracias por tu compra en Level-Up Gamer.');
                carrito = [];
                localStorage.removeItem('carrito');
                actualizarContador();
                renderizarCarrito();
            });
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    actualizarHeaderUsuario();
});

function actualizarHeaderUsuario() {
    const userActions = document.querySelector('.user-actions');
    if (!userActions) return;

    const currentUser = JSON.parse(localStorage.getItem('lug_current_user'));

    const esCarpetaHtml = window.location.pathname.includes('/html/');
    const rutaHtml = esCarpetaHtml ? '' : 'html/';
    const rutaInicio = esCarpetaHtml ? '../index.html' : 'index.html';

    if (currentUser) {
        const nombreMostrar = currentUser.nombre ? currentUser.nombre.split(' ')[0] : currentUser.email.split('@')[0];
        const esAdmin = currentUser.role === 'admin' || currentUser.email === 'admin@duoc.cl';

        userActions.innerHTML = `
            <span style="color: #00ffc8; font-weight: bold;">Hola, ${nombreMostrar}</span> | 
            ${esAdmin 
                ? `<a href="${rutaHtml}admin.html" style="color: #ffaa00; font-weight: bold;">Panel Admin</a> |` 
                : `<a href="${rutaHtml}perfil.html">Mi Perfil</a> |`
            }
            <a href="#" id="btnLogout" style="color: #ff5555;">Cerrar sesión</a>
            <a href="${rutaHtml}carrito.html" class="cart-btn">🛒 Cart (<span id="cart-count">0</span>)</a>
        `;

        document.getElementById('btnLogout').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('lug_current_user');
            alert('Has cerrado sesión correctamente.');
            window.location.href = rutaInicio;
        });
    }
}