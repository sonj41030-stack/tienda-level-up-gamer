document.addEventListener('DOMContentLoaded', () => {
    const formContacto = document.getElementById('contactoForm') || document.getElementById('contacto-form') || document.querySelector('form');

    if (!formContacto) return;

    function mostrarError(inputElem, errorElem, mensaje) {
        if (inputElem) {
            inputElem.classList.remove('input-success');
            inputElem.classList.add('input-error');
        }
        if (errorElem) {
            errorElem.textContent = mensaje;
        }
    }

    function mostrarExito(inputElem, errorElem) {
        if (inputElem) {
            inputElem.classList.remove('input-error');
            inputElem.classList.add('input-success');
        }
        if (errorElem) {
            errorElem.textContent = "";
        }
    }

    formContacto.addEventListener('submit', (e) => {
        e.preventDefault();
        let formValido = true;

        const nombreElem = document.getElementById('nombreContacto') || document.getElementById('nombre');
        const correoElem = document.getElementById('correoContacto') || document.getElementById('email') || document.getElementById('correo');
        const asuntoElem = document.getElementById('asuntoContacto') || document.getElementById('asunto');
        const mensajeElem = document.getElementById('mensajeContacto') || document.getElementById('mensaje');

        const errNombreElem = document.getElementById('errorNombreContacto') || document.getElementById('errorNombre');
        const errCorreoElem = document.getElementById('errorCorreoContacto') || document.getElementById('errorCorreo');
        const errAsuntoElem = document.getElementById('errorAsuntoContacto') || document.getElementById('errorAsunto');
        const errMensajeElem = document.getElementById('errorMensajeContacto') || document.getElementById('errorMensaje');

        const nombreVal = nombreElem ? nombreElem.value.trim() : '';
        if (!nombreVal) {
            mostrarError(nombreElem, errNombreElem, 'El nombre es requerido.');
            formValido = false;
        } else {
            mostrarExito(nombreElem, errNombreElem);
        }

        const correoVal = correoElem ? correoElem.value.trim() : '';
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correoVal) {
            mostrarError(correoElem, errCorreoElem, 'El correo es requerido.');
            formValido = false;
        } else if (!regexCorreo.test(correoVal)) {
            mostrarError(correoElem, errCorreoElem, 'Ingrese un correo válido.');
            formValido = false;
        } else {
            mostrarExito(correoElem, errCorreoElem);
        }

        const asuntoVal = asuntoElem ? asuntoElem.value.trim() : 'Consulta general';
        if (asuntoElem) {
            if (!asuntoVal) {
                mostrarError(asuntoElem, errAsuntoElem, 'El asunto es requerido.');
                formValido = false;
            } else {
                mostrarExito(asuntoElem, errAsuntoElem);
            }
        }

        const mensajeVal = mensajeElem ? mensajeElem.value.trim() : '';
        if (!mensajeVal) {
            mostrarError(mensajeElem, errMensajeElem, 'Debe escribir un mensaje.');
            formValido = false;
        } else {
            mostrarExito(mensajeElem, errMensajeElem);
        }

        if (formValido) {
            const nuevoMensaje = {
                fecha: new Date().toISOString().split('T')[0],
                nombre: nombreVal,
                email: correoVal,
                asunto: asuntoVal,
                mensaje: mensajeVal,
                estado: "Sin leer"
            };

            const messages = JSON.parse(localStorage.getItem('lug_messages')) || [];
            messages.push(nuevoMensaje);
            localStorage.setItem('lug_messages', JSON.stringify(messages));

            alert("¡Mensaje enviado correctamente! Nuestro equipo te contactará pronto.");
            
            formContacto.reset();

            [nombreElem, correoElem, asuntoElem, mensajeElem].forEach(elem => {
                if (elem) elem.classList.remove('input-success');
            });
        }
    });
});