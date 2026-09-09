document.addEventListener('DOMContentLoaded', () => {
    const articulos = [
        {
            id: 1,
            fecha: "15 Agosto, 2026",
            titulo: "Resumen de los mejores anuncios del año",
            categoria: "Gaming",
            imagen: "../images/sgf.jpg",
            resumen: "Desde nuevas consolas hasta expansiones inesperadas. Repasamos todo lo que nos dejó la última gran conferencia de videojuegos.",
            contenido: "La reciente conferencia anual de videojuegos dejó grandes sorpresas para la comunidad gamer. Entre los anuncios más destacados se encuentran el avance de consolas de nueva generación con soporte nativo para 8K, títulos indie revolucionarios y la expansión de grandes sagas de rol. Además, se confirmaron mejoras significativas en los motores gráficos que prometen iluminaciones fotorrealistas y tiempos de carga inexistentes."
        },
        {
            id: 2,
            fecha: "02 Agosto, 2026",
            titulo: "Estrategias avanzadas para dominar en Catan",
            categoria: "Catan",
            imagen: "../images/catanj.jpg",
            resumen: "¿Tus amigos siempre te roban la victoria? Descubre cómo optimizar tus recursos y negociar como un experto.",
            contenido: "Dominar Catan requiere más que buena suerte con los dados. La clave del éxito radica en la ubicación inicial de tus poblados priorizando la diversidad de recursos y la probabilidad numérica de los hexágonos (6 y 8). Aprender a gestionar la ruta más larga, monopolizar puertos estratégicos y utilizar el comercio de manera defensiva te asegurará tomar el control de la isla en tus próximas partidas."
        },
        {
            id: 3,
            fecha: "28 Julio, 2026",
            titulo: "Guía de compra: Cómo elegir tu primer teclado mecánico",
            categoria: "Hardware",
            imagen: "../images/teclado.jpg",
            resumen: "Switches rojos, azules o marrones. Te explicamos las diferencias para que encuentres el teclado perfecto para tu setup.",
            contenido: "Elegir un teclado mecánico depende directamente de tu tipo de uso. Los switches 'Red' son lineales y silenciosos, ideales para juegos competitivos por su rápida respuesta. Los switches 'Blue' ofrecen una respuesta táctil y auditiva (clicky) excelente para escribir, mientras que los 'Brown' representan el punto medio equilibrado entre trabajo y gaming. Considera también el formato: 100%, TKL (80%) o 60% según el espacio en tu escritorio."
        }
    ];

    const blogGrid = document.getElementById('blog-grid');
    const modal = document.getElementById('blog-modal');
    const closeModal = document.getElementById('close-modal');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalFecha = document.getElementById('modal-fecha');
    const modalCuerpo = document.getElementById('modal-cuerpo');

    if (!blogGrid) return;

    articulos.forEach(art => {
        const card = document.createElement('article');
        card.classList.add('product-card');

        card.innerHTML = `
            <img src="${art.imagen}" alt="${art.titulo}" class="blog-card-img">
            <p class="category" style="color: #00ffc8; font-size: 0.85rem; margin-top: 10px;">${art.fecha}</p>
            <h4 style="margin: 10px 0; font-family: 'Orbitron', sans-serif;">${art.titulo}</h4>
            <p class="product-desc">${art.resumen}</p>
            <button class="btn-secondary btn-leer" data-id="${art.id}" style="width: 100%; margin-top: 15px;">Leer artículo</button>
        `;

        blogGrid.appendChild(card);
    });

    blogGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-leer')) {
            const articleId = parseInt(e.target.dataset.id, 10);
            const articulo = articulos.find(a => a.id === articleId);

            if (articulo && modal && modalTitulo && modalFecha && modalCuerpo) {
                modalTitulo.textContent = articulo.titulo;
                modalFecha.textContent = `${articulo.categoria} • ${articulo.fecha}`;
                modalCuerpo.textContent = articulo.contenido;
                modal.style.display = 'flex';
            }
        }
    });

    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (modal && e.target === modal) {
            modal.style.display = 'none';
        }
    });
});