document.addEventListener("DOMContentLoaded", function () {


    /*
    ==========================================================
    PROTECCIÓN DEL ADMINISTRADOR
    ==========================================================
    */

    const sesion =
        localStorage.getItem("sesionIniciada");


    const usuarioActivo =
        JSON.parse(
            localStorage.getItem("usuarioActivo")
        );


    if (
        sesion !== "true" ||
        !usuarioActivo
    ) {

        window.location.href =
            "../paginas/login.html";

        return;

    }


    /*
    ==========================================================
    VALIDAR ROL
    ==========================================================
    */

    if (
        usuarioActivo.tipo !== "Administrador" &&
        usuarioActivo.tipo !== "Vendedor"
    ) {

        alert(
            "No tienes permisos para acceder al administrador."
        );

        window.location.href =
            "../index.html";

        return;

    }


    /*
    ==========================================================
    MOSTRAR USUARIO
    ==========================================================
    */

    document.getElementById(
        "nombre-admin"
    ).textContent =
        usuarioActivo.nombre +
        " " +
        usuarioActivo.apellido;


    /*
    ==========================================================
    ELEMENTOS
    ==========================================================
    */

    const secciones =
        document.querySelectorAll(
            ".admin-section"
        );


    const botonesMenu =
        document.querySelectorAll(
            ".menu-btn"
        );


    const titulo =
        document.getElementById(
            "titulo-seccion"
        );


    /*
    ==========================================================
    NAVEGACIÓN
    ==========================================================
    */

    botonesMenu.forEach(function (boton) {

        boton.addEventListener(
            "click",
            function () {

                const seccion =
                    boton.dataset.section;


                /*
                Vendedor no puede acceder a usuarios
                */

                if (
                    usuarioActivo.tipo === "Vendedor" &&
                    seccion === "usuarios"
                ) {

                    alert(
                        "Los vendedores no tienen acceso a los usuarios."
                    );

                    return;

                }


                botonesMenu.forEach(function (item) {

                    item.classList.remove(
                        "active"
                    );

                });


                boton.classList.add(
                    "active"
                );


                secciones.forEach(function (item) {

                    item.classList.remove(
                        "active"
                    );

                });


                const destino =
                    document.getElementById(
                        seccion
                    );


                if (destino) {

                    destino.classList.add(
                        "active"
                    );

                }


                titulo.textContent =
                    boton.textContent.trim();


                renderizarTodo();

            }
        );

    });


    /*
    ==========================================================
    PRODUCTOS
    ==========================================================
    */

    function obtenerProductos() {

        let productos = [];

        try {

            productos =
                JSON.parse(
                    localStorage.getItem("productos")
                ) || [];

        } catch (error) {

            productos = [];

        }


        /*
        Productos iniciales
        */

        if (productos.length === 0) {

            productos = [

                {
                    id: 1,
                    codigo: "PS5001",
                    nombre: "PlayStation 5",
                    descripcion:
                        "Consola PlayStation 5",
                    precio: 549990,
                    stock: 10,
                    stockCritico: 2,
                    categoria: "Consolas",
                    imagen: ""
                },


                {
                    id: 2,
                    codigo: "XBOX01",
                    nombre: "Xbox Series X",
                    descripcion:
                        "Consola Xbox Series X",
                    precio: 499990,
                    stock: 8,
                    stockCritico: 2,
                    categoria: "Consolas",
                    imagen: ""
                },


                {
                    id: 3,
                    codigo: "CONT01",
                    nombre: "Control Gamer",
                    descripcion:
                        "Control inalámbrico",
                    precio: 59990,
                    stock: 15,
                    stockCritico: 3,
                    categoria: "Accesorios",
                    imagen: ""
                }

            ];


            localStorage.setItem(
                "productos",
                JSON.stringify(productos)
            );

        }


        return productos;

    }


    function guardarProductos(productos) {

        localStorage.setItem(
            "productos",
            JSON.stringify(productos)
        );

    }


    /*
    ==========================================================
    MOSTRAR PRODUCTOS
    ==========================================================
    */

    function renderizarProductos() {

        const tabla =
            document.getElementById(
                "tabla-productos"
            );


        const productos =
            obtenerProductos();


        const texto =
            document.getElementById(
                "buscar-producto"
            ).value
            .toLowerCase()
            .trim();


        const categoria =
            document.getElementById(
                "filtro-categoria"
            ).value;


        const filtrados =
            productos.filter(
                function (producto) {

                    const coincideTexto =
                        producto.nombre
                            .toLowerCase()
                            .includes(texto) ||
                        producto.codigo
                            .toLowerCase()
                            .includes(texto);


                    const coincideCategoria =
                        categoria === "" ||
                        producto.categoria === categoria;


                    return (
                        coincideTexto &&
                        coincideCategoria
                    );

                }
            );


        tabla.innerHTML = "";


        if (filtrados.length === 0) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="7">
                        No se encontraron productos.
                    </td>
                </tr>
            `;

            return;

        }


        filtrados.forEach(
            function (producto) {

                const critico =
                    Number(producto.stock) <=
                    Number(producto.stockCritico);


                const fila =
                    document.createElement(
                        "tr"
                    );


                fila.innerHTML = `

                    <td>
                        ${producto.codigo}
                    </td>

                    <td>
                        ${producto.nombre}
                    </td>

                    <td>
                        ${producto.categoria}
                    </td>

                    <td>
                        $${Number(producto.precio).toLocaleString("es-CL")}
                    </td>

                    <td>
                        ${producto.stock}
                    </td>

                    <td class="${critico
                        ? "stock-critical"
                        : "stock-ok"}">

                        ${critico
                            ? "⚠️ Crítico"
                            : "✅ Disponible"}

                    </td>

                    <td>

                        <button
                            class="btn-edit"
                            data-edit-producto="${producto.id}"
                        >
                            Editar
                        </button>


                        <button
                            class="btn-delete"
                            data-delete-producto="${producto.id}"
                        >
                            Eliminar
                        </button>

                    </td>

                `;


                tabla.appendChild(
                    fila
                );

            }
        );


        /*
        BOTONES EDITAR
        */

        document
            .querySelectorAll(
                "[data-edit-producto]"
            )
            .forEach(function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        abrirEditarProducto(
                            Number(
                                boton.dataset.editProducto
                            )
                        );

                    }
                );

            });


        /*
        BOTONES ELIMINAR
        */

        document
            .querySelectorAll(
                "[data-delete-producto]"
            )
            .forEach(function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        eliminarProducto(
                            Number(
                                boton.dataset.deleteProducto
                            )
                        );

                    }
                );

            });

    }


    /*
    ==========================================================
    NUEVO PRODUCTO
    ==========================================================
    */

    document
        .getElementById(
            "nuevo-producto"
        )
        .addEventListener(
            "click",
            function () {

                document.getElementById(
                    "form-producto"
                ).reset();


                document.getElementById(
                    "producto-id"
                ).value = "";


                document.getElementById(
                    "modal-producto-titulo"
                ).textContent =
                    "Nuevo producto";


                abrirModal(
                    "modal-producto"
                );

            }
        );


    /*
    ==========================================================
    EDITAR PRODUCTO
    ==========================================================
    */

    function abrirEditarProducto(id) {

        const producto =
            obtenerProductos().find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!producto) return;


        document.getElementById(
            "producto-id"
        ).value =
            producto.id;


        document.getElementById(
            "producto-codigo"
        ).value =
            producto.codigo;


        document.getElementById(
            "producto-nombre"
        ).value =
            producto.nombre;


        document.getElementById(
            "producto-descripcion"
        ).value =
            producto.descripcion || "";


        document.getElementById(
            "producto-precio"
        ).value =
            producto.precio;


        document.getElementById(
            "producto-stock"
        ).value =
            producto.stock;


        document.getElementById(
            "producto-stock-critico"
        ).value =
            producto.stockCritico || 0;


        document.getElementById(
            "producto-categoria"
        ).value =
            producto.categoria;


        document.getElementById(
            "producto-imagen"
        ).value =
            producto.imagen || "";


        document.getElementById(
            "modal-producto-titulo"
        ).textContent =
            "Editar producto";


        abrirModal(
            "modal-producto"
        );

    }


    /*
    ==========================================================
    GUARDAR PRODUCTO
    ==========================================================
    */

    document
        .getElementById(
            "form-producto"
        )
        .addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const id =
                    document.getElementById(
                        "producto-id"
                    ).value;


                const codigo =
                    document.getElementById(
                        "producto-codigo"
                    ).value
                    .trim();


                const nombre =
                    document.getElementById(
                        "producto-nombre"
                    ).value
                    .trim();


                const descripcion =
                    document.getElementById(
                        "producto-descripcion"
                    ).value
                    .trim();


                const precio =
                    Number(
                        document.getElementById(
                            "producto-precio"
                        ).value
                    );


                const stock =
                    Number(
                        document.getElementById(
                            "producto-stock"
                        ).value
                    );


                const stockCritico =
                    Number(
                        document.getElementById(
                            "producto-stock-critico"
                        ).value
                    );


                const categoria =
                    document.getElementById(
                        "producto-categoria"
                    ).value;


                const imagen =
                    document.getElementById(
                        "producto-imagen"
                    ).value
                    .trim();


                const mensaje =
                    document.getElementById(
                        "mensaje-producto"
                    );


                /*
                VALIDACIONES
                */

                if (codigo.length < 3) {

                    mostrarFormMensaje(
                        mensaje,
                        "El código debe tener al menos 3 caracteres.",
                        "error"
                    );

                    return;

                }


                if (nombre === "") {

                    mostrarFormMensaje(
                        mensaje,
                        "El nombre es obligatorio.",
                        "error"
                    );

                    return;

                }


                if (nombre.length > 100) {

                    mostrarFormMensaje(
                        mensaje,
                        "El nombre no puede superar 100 caracteres.",
                        "error"
                    );

                    return;

                }


                if (
                    isNaN(precio) ||
                    precio < 0
                ) {

                    mostrarFormMensaje(
                        mensaje,
                        "El precio debe ser mayor o igual a 0.",
                        "error"
                    );

                    return;

                }


                if (
                    !Number.isInteger(stock) ||
                    stock < 0
                ) {

                    mostrarFormMensaje(
                        mensaje,
                        "El stock debe ser un número entero mayor o igual a 0.",
                        "error"
                    );

                    return;

                }


                if (
                    !categoria
                ) {

                    mostrarFormMensaje(
                        mensaje,
                        "Debe seleccionar una categoría.",
                        "error"
                    );

                    return;

                }


                const productos =
                    obtenerProductos();


                if (id === "") {

                    /*
                    NUEVO
                    */

                    productos.push({

                        id: Date.now(),

                        codigo,

                        nombre,

                        descripcion,

                        precio,

                        stock,

                        stockCritico,

                        categoria,

                        imagen

                    });

                } else {

                    /*
                    EDITAR
                    */

                    const indice =
                        productos.findIndex(
                            function (producto) {

                                return (
                                    String(
                                        producto.id
                                    ) === String(id)
                                );

                            }
                        );


                    if (
                        indice !== -1
                    ) {

                        productos[indice] = {

                            ...productos[indice],

                            codigo,

                            nombre,

                            descripcion,

                            precio,

                            stock,

                            stockCritico,

                            categoria,

                            imagen

                        };

                    }

                }


                guardarProductos(
                    productos
                );


                cerrarModal(
                    "modal-producto"
                );


                renderizarTodo();

            }
        );


    /*
    ==========================================================
    ELIMINAR PRODUCTO
    ==========================================================
    */

    function eliminarProducto(id) {

        const confirmar =
            confirm(
                "¿Seguro que deseas eliminar este producto?"
            );


        if (!confirmar) return;


        const productos =
            obtenerProductos()
                .filter(function (producto) {

                    return producto.id !== id;

                });


        guardarProductos(
            productos
        );


        renderizarTodo();

    }


    /*
    ==========================================================
    USUARIOS
    ==========================================================
    */

    function obtenerUsuarios() {

        try {

            return (
                JSON.parse(
                    localStorage.getItem(
                        "usuarios"
                    )
                ) || []
            );

        } catch (error) {

            return [];

        }

    }


    function guardarUsuarios(usuarios) {

        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuarios)
        );

    }


    /*
    ==========================================================
    REGIONES Y COMUNAS
    ==========================================================
    */

    const regiones = {

        "Arica y Parinacota": [
            "Arica",
            "Camarones",
            "Putre",
            "General Lagos"
        ],

        "Tarapacá": [
            "Iquique",
            "Alto Hospicio",
            "Pozo Almonte"
        ],

        "Antofagasta": [
            "Antofagasta",
            "Calama",
            "Tocopilla"
        ],

        "Coquimbo": [
            "La Serena",
            "Coquimbo",
            "Ovalle"
        ],

        "Valparaíso": [
            "Valparaíso",
            "Viña del Mar",
            "Quilpué",
            "San Antonio"
        ],

        "Metropolitana": [
            "Santiago",
            "Melipilla",
            "Maipú",
            "Puente Alto",
            "San Bernardo"
        ],

        "O'Higgins": [
            "Rancagua",
            "San Fernando",
            "Rengo"
        ],

        "Maule": [
            "Talca",
            "Curicó",
            "Linares"
        ],

        "Ñuble": [
            "Chillán",
            "Bulnes",
            "San Carlos"
        ],

        "Biobío": [
            "Concepción",
            "Talcahuano",
            "Los Ángeles"
        ]

    };


    function cargarRegiones(
        regionSeleccionada = ""
    ) {

        const select =
            document.getElementById(
                "usuario-region"
            );


        select.innerHTML =
            `<option value="">
                Seleccionar región
            </option>`;


        Object.keys(regiones).forEach(
            function (region) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    region;


                option.textContent =
                    region;


                if (
                    region ===
                    regionSeleccionada
                ) {

                    option.selected =
                        true;

                }


                select.appendChild(
                    option
                );

            }
        );


        cargarComunas(
            regionSeleccionada
        );

    }


    function cargarComunas(
        region
    ) {

        const select =
            document.getElementById(
                "usuario-comuna"
            );


        select.innerHTML =
            `<option value="">
                Seleccionar comuna
            </option>`;


        if (
            !regiones[region]
        ) return;


        regiones[region].forEach(
            function (comuna) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    comuna;


                option.textContent =
                    comuna;


                select.appendChild(
                    option
                );

            }
        );

    }


    document
        .getElementById(
            "usuario-region"
        )
        .addEventListener(
            "change",
            function () {

                cargarComunas(
                    this.value
                );

            }
        );


    /*
    ==========================================================
    MOSTRAR USUARIOS
    ==========================================================
    */

    function renderizarUsuarios() {

        const tabla =
            document.getElementById(
                "tabla-usuarios"
            );


        const usuarios =
            obtenerUsuarios();


        const texto =
            document.getElementById(
                "buscar-usuario"
            ).value
            .toLowerCase()
            .trim();


        const rol =
            document.getElementById(
                "filtro-rol"
            ).value;


        const filtrados =
            usuarios.filter(
                function (usuario) {

                    const coincideTexto =

                        (
                            usuario.nombre ||
                            ""
                        )
                        .toLowerCase()
                        .includes(texto)

                        ||

                        (
                            usuario.apellido ||
                            ""
                        )
                        .toLowerCase()
                        .includes(texto)

                        ||

                        (
                            usuario.correo ||
                            ""
                        )
                        .toLowerCase()
                        .includes(texto)

                        ||

                        (
                            usuario.run ||
                            ""
                        )
                        .toLowerCase()
                        .includes(texto);


                    const coincideRol =
                        rol === "" ||
                        usuario.tipo === rol;


                    return (
                        coincideTexto &&
                        coincideRol
                    );

                }
            );


        tabla.innerHTML = "";


        filtrados.forEach(
            function (usuario) {

                const fila =
                    document.createElement(
                        "tr"
                    );


                fila.innerHTML = `

                    <td>
                        ${usuario.run || "-"}
                    </td>

                    <td>
                        ${(usuario.nombre || "")}
                        ${(usuario.apellido || "")}
                    </td>

                    <td>
                        ${usuario.correo || "-"}
                    </td>

                    <td>
                        ${usuario.tipo || "Cliente"}
                    </td>

                    <td>
                        ${usuario.region || "-"}
                    </td>

                    <td>
                        ${usuario.comuna || "-"}
                    </td>

                    <td>

                        <button
                            class="btn-edit"
                            data-edit-usuario="${usuario.id}"
                        >
                            Editar
                        </button>


                        <button
                            class="btn-delete"
                            data-delete-usuario="${usuario.id}"
                        >
                            Eliminar
                        </button>

                    </td>

                `;


                tabla.appendChild(
                    fila
                );

            }
        );


        /*
        EDITAR
        */

        document
            .querySelectorAll(
                "[data-edit-usuario]"
            )
            .forEach(
                function (boton) {

                    boton.addEventListener(
                        "click",
                        function () {

                            abrirEditarUsuario(
                                boton.dataset
                                    .editUsuario
                            );

                        }
                    );

                }
            );


        /*
        ELIMINAR
        */

        document
            .querySelectorAll(
                "[data-delete-usuario]"
            )
            .forEach(
                function (boton) {

                    boton.addEventListener(
                        "click",
                        function () {

                            eliminarUsuario(
                                boton.dataset
                                    .deleteUsuario
                            );

                        }
                    );

                }
            );

    }


    /*
    ==========================================================
    NUEVO USUARIO
    ==========================================================
    */

    document
        .getElementById(
            "nuevo-usuario"
        )
        .addEventListener(
            "click",
            function () {

                document.getElementById(
                    "form-usuario"
                ).reset();


                document.getElementById(
                    "usuario-id"
                ).value = "";


                document.getElementById(
                    "modal-usuario-titulo"
                ).textContent =
                    "Nuevo usuario";


                cargarRegiones();


                abrirModal(
                    "modal-usuario"
                );

            }
        );


    /*
    ==========================================================
    EDITAR USUARIO
    ==========================================================
    */

    function abrirEditarUsuario(id) {

        const usuario =
            obtenerUsuarios().find(
                function (item) {

                    return String(
                        item.id
                    ) === String(id);

                }
            );


        if (!usuario) return;


        document.getElementById(
            "usuario-id"
        ).value =
            usuario.id;


        document.getElementById(
            "usuario-run"
        ).value =
            usuario.run || "";


        document.getElementById(
            "usuario-nombre"
        ).value =
            usuario.nombre || "";


        document.getElementById(
            "usuario-apellido"
        ).value =
            usuario.apellido || "";


        document.getElementById(
            "usuario-correo"
        ).value =
            usuario.correo || "";


        document.getElementById(
            "usuario-password"
        ).value =
            usuario.password || "";


        document.getElementById(
            "usuario-fecha"
        ).value =
            usuario.fecha || "";


        document.getElementById(
            "usuario-tipo"
        ).value =
            usuario.tipo || "Cliente";


        document.getElementById(
            "usuario-direccion"
        ).value =
            usuario.direccion || "";


        cargarRegiones(
            usuario.region || ""
        );


        cargarComunas(
            usuario.region || ""
        );


        document.getElementById(
            "usuario-comuna"
        ).value =
            usuario.comuna || "";


        document.getElementById(
            "modal-usuario-titulo"
        ).textContent =
            "Editar usuario";


        abrirModal(
            "modal-usuario"
        );

    }


    /*
    ==========================================================
    GUARDAR USUARIO
    ==========================================================
    */

    document
        .getElementById(
            "form-usuario"
        )
        .addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const id =
                    document.getElementById(
                        "usuario-id"
                    ).value;


                const run =
                    document.getElementById(
                        "usuario-run"
                    ).value
                    .trim()
                    .toUpperCase();


                const nombre =
                    document.getElementById(
                        "usuario-nombre"
                    ).value
                    .trim();


                const apellido =
                    document.getElementById(
                        "usuario-apellido"
                    ).value
                    .trim();


                const correo =
                    document.getElementById(
                        "usuario-correo"
                    ).value
                    .trim()
                    .toLowerCase();


                const password =
                    document.getElementById(
                        "usuario-password"
                    ).value;


                const fecha =
                    document.getElementById(
                        "usuario-fecha"
                    ).value;


                const tipo =
                    document.getElementById(
                        "usuario-tipo"
                    ).value;


                const region =
                    document.getElementById(
                        "usuario-region"
                    ).value;


                const comuna =
                    document.getElementById(
                        "usuario-comuna"
                    ).value;


                const direccion =
                    document.getElementById(
                        "usuario-direccion"
                    ).value
                    .trim();


                const mensaje =
                    document.getElementById(
                        "mensaje-usuario"
                    );


                /*
                VALIDACIONES
                */

                if (
                    run.length < 7 ||
                    run.length > 9
                ) {

                    mostrarFormMensaje(
                        mensaje,
                        "El RUN debe tener entre 7 y 9 caracteres.",
                        "error"
                    );

                    return;

                }


                if (nombre === "") {

                    mostrarFormMensaje(
                        mensaje,
                        "El nombre es obligatorio.",
                        "error"
                    );

                    return;

                }


                if (nombre.length > 50) {

                    mostrarFormMensaje(
                        mensaje,
                        "El nombre no puede superar 50 caracteres.",
                        "error"
                    );

                    return;

                }


                if (apellido === "") {

                    mostrarFormMensaje(
                        mensaje,
                        "Los apellidos son obligatorios.",
                        "error"
                    );

                    return;

                }


                if (correo.length > 100) {

                    mostrarFormMensaje(
                        mensaje,
                        "El correo no puede superar 100 caracteres.",
                        "error"
                    );

                    return;

                }


                if (
                    !(
                        correo.endsWith("@duoc.cl") ||
                        correo.endsWith("@profesor.duoc.cl") ||
                        correo.endsWith("@gmail.com")
                    )
                ) {

                    mostrarFormMensaje(
                        mensaje,
                        "Correo no permitido.",
                        "error"
                    );

                    return;

                }


                if (
                    password.length < 4 ||
                    password.length > 10
                ) {

                    mostrarFormMensaje(
                        mensaje,
                        "La contraseña debe tener entre 4 y 10 caracteres.",
                        "error"
                    );

                    return;

                }


                if (direccion === "") {

                    mostrarFormMensaje(
                        mensaje,
                        "La dirección es obligatoria.",
                        "error"
                    );

                    return;

                }


                const usuarios =
                    obtenerUsuarios();


                /*
                EVITAR CORREOS REPETIDOS
                */

                const correoExiste =
                    usuarios.some(
                        function (usuario) {

                            return (
                                usuario.correo === correo &&
                                String(usuario.id) !==
                                String(id)
                            );

                        }
                    );


                if (correoExiste) {

                    mostrarFormMensaje(
                        mensaje,
                        "Ese correo ya está registrado.",
                        "error"
                    );

                    return;

                }


                /*
                NUEVO USUARIO
                */

                if (id === "") {

                    usuarios.push({

                        id: Date.now(),

                        run,

                        nombre,

                        apellido,

                        correo,

                        password,

                        fecha,

                        tipo,

                        region,

                        comuna,

                        direccion

                    });

                } else {

                    /*
                    EDITAR
                    */

                    const indice =
                        usuarios.findIndex(
                            function (usuario) {

                                return (
                                    String(
                                        usuario.id
                                    ) === String(id)
                                );

                            }
                        );


                    if (
                        indice !== -1
                    ) {

                        usuarios[indice] = {

                            ...usuarios[indice],

                            run,

                            nombre,

                            apellido,

                            correo,

                            password,

                            fecha,

                            tipo,

                            region,

                            comuna,

                            direccion

                        };

                    }

                }


                guardarUsuarios(
                    usuarios
                );


                cerrarModal(
                    "modal-usuario"
                );


                renderizarTodo();

            }
        );


    /*
    ==========================================================
    ELIMINAR USUARIO
    ==========================================================
    */

    function eliminarUsuario(id) {

        const usuario =
            obtenerUsuarios().find(
                function (item) {

                    return String(
                        item.id
                    ) === String(id);

                }
            );


        if (
            usuario &&
            usuario.tipo === "Administrador" &&
            usuario.correo === "admin@duoc.cl"
        ) {

            alert(
                "No puedes eliminar el administrador principal."
            );

            return;

        }


        if (
            !confirm(
                "¿Seguro que deseas eliminar este usuario?"
            )
        ) {

            return;

        }


        const usuarios =
            obtenerUsuarios().filter(
                function (item) {

                    return String(
                        item.id
                    ) !== String(id);

                }
            );


        guardarUsuarios(
            usuarios
        );


        renderizarTodo();

    }


    /*
    ==========================================================
    DASHBOARD
    ==========================================================
    */

    function renderizarDashboard() {

        const productos =
            obtenerProductos();


        const usuarios =
            obtenerUsuarios();


        const stockTotal =
            productos.reduce(
                function (total, producto) {

                    return (
                        total +
                        Number(
                            producto.stock
                        )
                    );

                },
                0
            );


        const criticos =
            productos.filter(
                function (producto) {

                    return (
                        Number(producto.stock) <=
                        Number(
                            producto.stockCritico
                        )
                    );

                }
            ).length;


        document.getElementById(
            "total-productos"
        ).textContent =
            productos.length;


        document.getElementById(
            "total-usuarios"
        ).textContent =
            usuarios.length;


        document.getElementById(
            "stock-total"
        ).textContent =
            stockTotal;


        document.getElementById(
            "productos-criticos"
        ).textContent =
            criticos;


        const contenedor =
            document.getElementById(
                "productos-dashboard"
            );


        const ultimos =
            productos.slice(-5).reverse();


        if (ultimos.length === 0) {

            contenedor.innerHTML =
                "<p>No hay productos.</p>";

            return;

        }


        contenedor.innerHTML =
            ultimos.map(
                function (producto) {

                    return `

                        <div style="
                            padding:15px;
                            border-bottom:1px solid #eee;
                        ">

                            <strong>
                                ${producto.nombre}
                            </strong>

                            <br>

                            <span>
                                Stock:
                                ${producto.stock}
                            </span>

                        </div>

                    `;

                }
            ).join("");

    }


    /*
    ==========================================================
    MODALES
    ==========================================================
    */

    function abrirModal(id) {

        document.getElementById(
            id
        ).classList.add(
            "show"
        );

    }


    function cerrarModal(id) {

        document.getElementById(
            id
        ).classList.remove(
            "show"
        );

    }


    document
        .querySelectorAll(
            ".close-modal"
        )
        .forEach(
            function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        cerrarModal(
                            boton.dataset.close
                        );

                    }
                );

            }
        );


    /*
    Cerrar modal haciendo click fuera
    */

    document
        .querySelectorAll(
            ".modal"
        )
        .forEach(
            function (modal) {

                modal.addEventListener(
                    "click",
                    function (event) {

                        if (
                            event.target ===
                            modal
                        ) {

                            cerrarModal(
                                modal.id
                            );

                        }

                    }
                );

            }
        );


    /*
    ==========================================================
    FILTROS
    ==========================================================
    */

    document
        .getElementById(
            "buscar-producto"
        )
        .addEventListener(
            "input",
            renderizarProductos
        );


    document
        .getElementById(
            "filtro-categoria"
        )
        .addEventListener(
            "change",
            renderizarProductos
        );


    document
        .getElementById(
            "buscar-usuario"
        )
        .addEventListener(
            "input",
            renderizarUsuarios
        );


    document
        .getElementById(
            "filtro-rol"
        )
        .addEventListener(
            "change",
            renderizarUsuarios
        );


    /*
    ==========================================================
    CERRAR SESIÓN
    ==========================================================
    */

    document
        .getElementById(
            "cerrar-sesion"
        )
        .addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "sesionIniciada"
                );


                localStorage.removeItem(
                    "usuarioActivo"
                );


                window.location.href =
                    "../paginas/login.html";

            }
        );


    /*
    ==========================================================
    UTILIDAD MENSAJES
    ==========================================================
    */

    function mostrarFormMensaje(
        elemento,
        texto,
        tipo
    ) {

        elemento.textContent =
            texto;

        elemento.className =
            "mensaje-form " + tipo;

    }


    /*
    ==========================================================
    RENDERIZAR TODO
    ==========================================================
    */

    function renderizarTodo() {

        renderizarProductos();

        renderizarUsuarios();

        renderizarDashboard();

    }


    /*
    INICIO
    */

    cargarRegiones();

    renderizarTodo();

});