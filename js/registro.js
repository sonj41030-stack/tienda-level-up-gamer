const formularioRegistro = document.getElementById("formularioRegistro");

const comunas = {
    "Metropolitana": [
        "Melipilla",
        "Maipú",
        "Santiago",
        "Puente Alto"
    ],

    "Valparaíso": [
        "Valparaíso",
        "Viña del Mar",
        "Quilpué"
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

    "Biobío": [
        "Concepción",
        "Los Ángeles",
        "Talcahuano"
    ]
};


// Cambiar comunas según región
document.getElementById("region").addEventListener("change", function() {

    const regionSeleccionada = this.value;
    const comuna = document.getElementById("comuna");

    comuna.innerHTML =
        '<option value="">Selecciona una comuna</option>';

    if (comunas[regionSeleccionada]) {

        comunas[regionSeleccionada].forEach(function(nombreComuna) {

            const opcion = document.createElement("option");

            opcion.value = nombreComuna;
            opcion.textContent = nombreComuna;

            comuna.appendChild(opcion);
        });
    }
});


// Registrar usuario
formularioRegistro.addEventListener("submit", function(event) {

    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const run = document.getElementById("run").value.trim();
    const correo = document.getElementById("email").value.trim();
    const fecha = document.getElementById("fecha").value;
    const region = document.getElementById("region").value;
    const comuna = document.getElementById("comuna").value;
    const direccion = document.getElementById("direccion").value.trim();
    const password = document.getElementById("password").value;
    const confirmarPassword =
        document.getElementById("confirmarPassword").value;

    const mensaje = document.getElementById("mensajeRegistro");


    // Validar correo
    const correoValido =
        correo.endsWith("@duoc.cl") ||
        correo.endsWith("@profesor.duoc.cl") ||
        correo.endsWith("@gmail.com");

    if (!correoValido) {
        mensaje.textContent =
            "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com";
        mensaje.style.color = "red";
        return;
    }


    // Validar RUN
    const runValido = /^[0-9]{7,8}[0-9Kk]$/.test(run);

    if (!runValido) {
        mensaje.textContent =
            "El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion.";
        mensaje.style.color = "red";
        return;
    }


    // Validar contraseña
    if (password.length < 4 || password.length > 10) {
        mensaje.textContent =
            "La contraseña debe tener entre 4 y 10 caracteres.";
        mensaje.style.color = "red";
        return;
    }


    // Confirmar contraseña
    if (password !== confirmarPassword) {
        mensaje.textContent =
            "Las contraseñas no coinciden.";
        mensaje.style.color = "red";
        return;
    }


    // Crear usuario
    const usuario = {
        id: Date.now(),
        nombre: nombre,
        apellido: apellido,
        run: run,
        correo: correo,
        fecha: fecha,
        region: region,
        comuna: comuna,
        direccion: direccion,
        password: password,
        tipo: "Cliente"
    };


    // Guardar usuario en la lista de usuarios (para poder iniciar sesión)
    let usuarios = [];

    try {
        usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    } catch (error) {
        usuarios = [];
    }

    const correoRepetido = usuarios.some(function (u) {
        return u.correo && u.correo.toLowerCase() === correo.toLowerCase();
    });

    if (correoRepetido) {
        mensaje.textContent = "Ese correo ya está registrado.";
        mensaje.style.color = "red";
        return;
    }

    usuarios.push(usuario);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));


    mensaje.textContent =
        "¡Usuario registrado correctamente!";
    mensaje.style.color = "green";


    setTimeout(function() {
        window.location.href = "login.html";
    }, 1000);

});