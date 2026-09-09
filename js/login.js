document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("form-login");
    const correoInput = document.getElementById("correo");
    const claveInput = document.getElementById("clave");
    const mensaje = document.getElementById("mensaje-login");


    /*
    ==================================================
    MOSTRAR MENSAJE
    ==================================================
    */

    function mostrarMensaje(texto, tipo) {

        mensaje.textContent = texto;

        mensaje.className = "form-message " + tipo;
    }


    /*
    ==================================================
    VALIDAR CORREO
    ==================================================
    */

    function validarCorreo(correo) {

        return (
            correo.endsWith("@duoc.cl") ||
            correo.endsWith("@profesor.duoc.cl") ||
            correo.endsWith("@gmail.com")
        );
    }


    /*
    ==================================================
    OBTENER USUARIOS
    ==================================================
    */

    function obtenerUsuarios() {

        let usuarios = [];

        try {

            usuarios =
                JSON.parse(
                    localStorage.getItem("usuarios")
                ) || [];

        } catch (error) {

            usuarios = [];

        }


        /*
        Usuario administrador por defecto
        */

        const existeAdministrador =
            usuarios.some(function (usuario) {

                return (
                    usuario.correo &&
                    usuario.correo.toLowerCase() ===
                    "admin@duoc.cl"
                );

            });


        if (!existeAdministrador) {

            usuarios.push({

                id: "ADMIN001",

                nombre: "Administrador",

                apellido: "Level-Up",

                run: "19011022K",

                correo: "admin@duoc.cl",

                password: "admin123",

                fecha: "",

                region: "Metropolitana",

                comuna: "Melipilla",

                direccion: "",

                tipo: "Administrador"

            });


            localStorage.setItem(
                "usuarios",
                JSON.stringify(usuarios)
            );

        }


        return usuarios;
    }


    /*
    ==================================================
    GUARDAR SESIÓN
    ==================================================
    */

    function iniciarSesion(usuario) {

        const usuarioActivo = {

            id: usuario.id,

            nombre: usuario.nombre,

            apellido: usuario.apellido,

            correo: usuario.correo,

            tipo: usuario.tipo || "Cliente"

        };


        localStorage.setItem(
            "usuarioActivo",
            JSON.stringify(usuarioActivo)
        );


        localStorage.setItem(
            "sesionIniciada",
            "true"
        );

    }


    /*
    ==================================================
    LOGIN
    ==================================================
    */

    formulario.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const correo =
                correoInput.value
                    .trim()
                    .toLowerCase();


            const password =
                claveInput.value;


            /*
            VALIDACIÓN CORREO
            */

            if (correo === "") {

                mostrarMensaje(
                    "El correo es obligatorio.",
                    "error"
                );

                correoInput.focus();

                return;
            }


            if (correo.length > 100) {

                mostrarMensaje(
                    "El correo no puede superar los 100 caracteres.",
                    "error"
                );

                correoInput.focus();

                return;
            }


            if (!validarCorreo(correo)) {

                mostrarMensaje(
                    "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.",
                    "error"
                );

                correoInput.focus();

                return;
            }


            /*
            VALIDACIÓN CONTRASEÑA
            */

            if (password === "") {

                mostrarMensaje(
                    "La contraseña es obligatoria.",
                    "error"
                );

                claveInput.focus();

                return;
            }


            if (
                password.length < 4 ||
                password.length > 10
            ) {

                mostrarMensaje(
                    "La contraseña debe tener entre 4 y 10 caracteres.",
                    "error"
                );

                claveInput.focus();

                return;
            }


            /*
            BUSCAR USUARIO
            */

            const usuarios = obtenerUsuarios();


            const usuario =
                usuarios.find(function (item) {

                    return (
                        item.correo &&
                        item.correo.toLowerCase() ===
                        correo &&
                        item.password ===
                        password
                    );

                });


            /*
            USUARIO NO ENCONTRADO
            */

            if (!usuario) {

                mostrarMensaje(
                    "Correo o contraseña incorrectos.",
                    "error"
                );

                return;
            }


            /*
            SESIÓN CORRECTA
            */

            iniciarSesion(usuario);


            mostrarMensaje(
                "Inicio de sesión correcto.",
                "success"
            );


            /*
            REDIRECCIÓN SEGÚN ROL
            */

            setTimeout(function () {

                if (
                    usuario.tipo === "Administrador" ||
                    usuario.tipo === "Vendedor"
                ) {

                    window.location.href =
                        "../admin/index.html";

                } else {

                    window.location.href =
                        "../index.html";

                }

            }, 700);

        }
    );


    /*
    ==================================================
    VALIDACIÓN EN TIEMPO REAL
    ==================================================
    */

    correoInput.addEventListener(
        "input",
        function () {

            const correo =
                correoInput.value
                    .trim()
                    .toLowerCase();


            if (correo === "") {

                mostrarMensaje(
                    "Ingrese su correo.",
                    "error"
                );

                return;
            }


            if (
                validarCorreo(correo) &&
                correo.length <= 100
            ) {

                mostrarMensaje(
                    "Correo válido.",
                    "success"
                );

            } else {

                mostrarMensaje(
                    "Correo no permitido.",
                    "error"
                );

            }

        }
    );


    claveInput.addEventListener(
        "input",
        function () {

            const cantidad =
                claveInput.value.length;


            if (cantidad === 0) {

                mensaje.textContent = "";

                mensaje.className =
                    "form-message";

                return;
            }


            if (
                cantidad >= 4 &&
                cantidad <= 10
            ) {

                mostrarMensaje(
                    "Contraseña válida.",
                    "success"
                );

            } else {

                mostrarMensaje(
                    "La contraseña debe tener entre 4 y 10 caracteres.",
                    "error"
                );

            }

        }
    );

});