document.addEventListener('DOMContentLoaded', () => {
    initAdminNavigation();
    initMockData();
    renderDashboardStats();
    renderUsuarios();
    renderOrdenes();
    renderMensajes();
});

function initAdminNavigation() {
    const navLinks = document.querySelectorAll('.sidebar a[data-target]');
    const sections = document.querySelectorAll('.admin-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');

            sections.forEach(sec => sec.style.display = 'none');

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }

            renderDashboardStats();
            if (targetId === 'mensajes') renderMensajes();
            if (targetId === 'usuarios') renderUsuarios();
            if (targetId === 'ordenes') renderOrdenes();
        });
    });
}
/*este bloque agrega correos, ordenes o mensajes en caso de que no hayan para que el admin vea como funciona la pagina
function initMockData() {
    if (!localStorage.getItem('lug_users')) {
        const mockUsers = [
            { nombre: "Gonzalo Pérez", email: "gonzalo@gmail.com", points: 1200, level: "Pro Gamer", myReferralCode: "LUG-1024" },
            { nombre: "María López", email: "maria@outlook.com", points: 300, level: "Novato", myReferralCode: "LUG-8831" }
        ];
        localStorage.setItem('lug_users', JSON.stringify(mockUsers));
    }

    if (!localStorage.getItem('lug_orders')) {
        const mockOrders = [
            { id: "ORD-001", cliente: "Gonzalo Pérez", total: 45990, estado: "Completado" },
            { id: "ORD-002", cliente: "María López", total: 18990, estado: "Pendiente" }
        ];
        localStorage.setItem('lug_orders', JSON.stringify(mockOrders));
    }

    if (!localStorage.getItem('lug_messages')) {
        const mockMessages = [
            { fecha: "2026-09-01", nombre: "Carlos R.", email: "carlos@mail.com", mensaje: "Consulta sobre stock del juego Catan.", estado: "Sin leer" },
            { fecha: "2026-09-03", nombre: "Ana M.", email: "ana@mail.com", mensaje: "Problema con la clave de mi cuenta.", estado: "Sin leer" }
        ];
        localStorage.setItem('lug_messages', JSON.stringify(mockMessages));
    }
}

function renderDashboardStats() {
    const users = JSON.parse(localStorage.getItem('lug_users')) || [];
    const orders = JSON.parse(localStorage.getItem('lug_orders')) || [];
    const messages = JSON.parse(localStorage.getItem('lug_messages')) || [];

    const unreadCount = messages.filter(m => m.estado === "Sin leer").length;

    const elemUsers = document.getElementById('stat-usuarios-count');
    const elemOrders = document.getElementById('stat-ordenes-count');
    const elemMessages = document.getElementById('stat-mensajes-count');

    if (elemUsers) elemUsers.textContent = users.length;
    if (elemOrders) elemOrders.textContent = orders.length;
    if (elemMessages) elemMessages.textContent = unreadCount;
}

function renderUsuarios() {
    const users = JSON.parse(localStorage.getItem('lug_users')) || [];
    const tbody = document.getElementById('tabla-usuarios-body');
    if (!tbody) return;

    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="padding: 15px; text-align: center; color: #888;">No hay usuarios registrados.</td></tr>`;
        return;
    }

    tbody.innerHTML = users.map(u => `
        <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 10px;">${u.nombre || 'Sin nombre'}</td>
            <td style="padding: 10px;">${u.email}</td>
            <td style="padding: 10px; color: #00ffcc;">${u.points || 0}</td>
            <td style="padding: 10px;">${u.level || 'Novato'}</td>
            <td style="padding: 10px;">${u.myReferralCode || 'N/A'}</td>
            <td style="padding: 10px;">
                <button onclick="deleteUser('${u.email}')" style="background: #ff4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">
                    Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}

function renderOrdenes() {
    const orders = JSON.parse(localStorage.getItem('lug_orders')) || [];
    const tbody = document.getElementById('tabla-ordenes-body');
    if (!tbody) return;

    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="padding: 15px; text-align: center; color: #888;">No hay órdenes registradas.</td></tr>`;
        return;
    }

    tbody.innerHTML = orders.map(o => `
        <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 10px;">${o.id}</td>
            <td style="padding: 10px;">${o.cliente}</td>
            <td style="padding: 10px;">$${Number(o.total).toLocaleString('es-CL')}</td>
            <td style="padding: 10px; color: ${o.estado === 'Completado' ? '#00ffc8' : '#ffaa00'};">${o.estado}</td>
            <td style="padding: 10px; display: flex; gap: 8px;">
                <button onclick="toggleOrderStatus('${o.id}')" style="background: #0088ff; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                    Cambiar Estado
                </button>
                <button onclick="deleteOrder('${o.id}')" style="background: #ff4444; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                    Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}

function renderMensajes() {
    const messages = JSON.parse(localStorage.getItem('lug_messages')) || [];
    const tbody = document.getElementById('tabla-mensajes-body');
    if (!tbody) return;

    if (messages.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="padding: 15px; text-align: center; color: #888;">No hay mensajes en la bandeja.</td></tr>`;
        return;
    }

    tbody.innerHTML = messages.map((m, index) => `
        <tr style="border-bottom: 1px solid #333;">
            <td style="padding: 10px; color: #aaa; white-space: nowrap;">${m.fecha || 'Sin fecha'}</td>
            <td style="padding: 10px;">${m.nombre || 'Anónimo'}</td>
            <td style="padding: 10px;">${m.email || 'Sin correo'}</td>
            <td style="padding: 10px; max-width: 280px;">${m.mensaje || ''}</td>
            <td style="padding: 10px; font-weight: bold; color: ${m.estado === 'Sin leer' ? '#00ffcc' : '#888'};">${m.estado || 'Sin leer'}</td>
            <td style="padding: 10px; display: flex; gap: 8px;">
                <button onclick="toggleMessageStatus(${index})" style="background: ${m.estado === 'Sin leer' ? '#00ffcc' : '#555'}; color: #000; font-weight: bold; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                    ${m.estado === 'Sin leer' ? 'Marcar Leído' : 'Marcar Sin Leer'}
                </button>
                <button onclick="deleteMessage(${index})" style="background: #ff4444; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                    Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}

function deleteUser(email) {
    if (confirm(`¿Estás seguro de que deseas eliminar al usuario con correo ${email}?`)) {
        let users = JSON.parse(localStorage.getItem('lug_users')) || [];
        users = users.filter(u => u.email !== email);
        localStorage.setItem('lug_users', JSON.stringify(users));
        renderUsuarios();
        renderDashboardStats();
    }
}

function toggleOrderStatus(orderId) {
    let orders = JSON.parse(localStorage.getItem('lug_orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex !== -1) {
        orders[orderIndex].estado = orders[orderIndex].estado === 'Completado' ? 'Pendiente' : 'Completado';
        localStorage.setItem('lug_orders', JSON.stringify(orders));
        renderOrdenes();
    }
}

function deleteOrder(orderId) {
    if (confirm(`¿Estás seguro de eliminar la orden ${orderId}?`)) {
        let orders = JSON.parse(localStorage.getItem('lug_orders')) || [];
        orders = orders.filter(o => o.id !== orderId);
        localStorage.setItem('lug_orders', JSON.stringify(orders));
        renderOrdenes();
        renderDashboardStats();
    }
}

function toggleMessageStatus(index) {
    let messages = JSON.parse(localStorage.getItem('lug_messages')) || [];
    if (messages[index]) {
        messages[index].estado = messages[index].estado === 'Sin leer' ? 'Leído' : 'Sin leer';
        localStorage.setItem('lug_messages', JSON.stringify(messages));
        renderMensajes();
        renderDashboardStats();
    }
}

function deleteMessage(index) {
    if (confirm('¿Deseas eliminar este mensaje?')) {
        let messages = JSON.parse(localStorage.getItem('lug_messages')) || [];
        messages.splice(index, 1);
        localStorage.setItem('lug_messages', JSON.stringify(messages));
        renderMensajes();
        renderDashboardStats();
    }
}