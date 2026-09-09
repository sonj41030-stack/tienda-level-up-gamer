document.addEventListener(
    "DOMContentLoaded",
    function () {


        const formulario =
            document.getElementById(
                "form-contacto"
            );


        const nombre =
            document.getElementById(
                "contacto-nombre"
            );


        const correo =
            document.getElementById(
                "contacto-correo"
            );


        const comentario =
            document.getElementById(
                "contacto-comentario"
            );


        const errorNombre =
            document.getElementById(
                "error-nombre"
            );


        const errorCorreo =
            document.getElementById(
                "error-correo"
            );


        const errorComentario =
            document.getElementById(
                "error-comentario"
            );


        const mensaje =
            document.getElementById(
                "mensaje-contacto"
            );


        const contadorComentario =
            document.getElementById(
                "contador-comentario"
            );



        /*
        ==============================================
        VALIDAR CORREO
        ==============================================
        */

        function correoPermitido(valor) {

            const correoNormalizado =
                valor
                    .trim()
                    .toLowerCase();


            return (
                correoNormalizado.endsWith(
                    "@duoc.cl"
                ) ||

                correoNormalizado.endsWith(
                    "@profesor.duoc.cl"
                ) ||

                correoNormalizado.endsWith(
                    "@gmail.com"
                )
            );

        }



        /*
        ==============================================
        VALIDAR NOMBRE
        ==============================================
        */

        function validarNombre() {

            const valor =
                nombre.value.trim();


            if (valor === "") {

                errorNombre.textContent =
                    "El nombre es obligatorio.";

                errorNombre.className =
                    "field-message error";

                return false;

            }


            if (valor.length > 100) {

                errorNombre.textContent =
                    "El nombre no puede superar los 100 caracteres.";

                errorNombre.className =
                    "field-message error";

                return false;

            }


            errorNombre.textContent =
                "Nombre válido.";

            errorNombre.className =
                "field-message success";


            return true;

        }



        /*
        ==============================================
        VALIDAR CORREO
        ==============================================
        */

        function validarCorreo() {

            const valor =
                correo.value.trim();


            /*
            El correo no aparece como requerido
            en la pauta.
            */

            if (valor === "") {

                errorCorreo.textContent = "";

                errorCorreo.className =
                    "field-message";

                return true;

            }


            if (valor.length > 100) {

                errorCorreo.textContent =
                    "El correo no puede superar los 100 caracteres.";

                errorCorreo.className =
                    "field-message error";

                return false;

            }


            if (!correoPermitido(valor)) {

                errorCorreo.textContent =
                    "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";

                errorCorreo.className =
                    "field-message error";

                return false;

            }


            errorCorreo.textContent =
                "Correo válido.";

            errorCorreo.className =
                "field-message success";


            return true;

        }



        /*
        ==============================================
        VALIDAR COMENTARIO
        ==============================================
        */

        function validarComentario() {

            const valor =
                comentario.value.trim();


            if (valor === "") {

                errorComentario.textContent =
                    "El comentario es obligatorio.";

                errorComentario.className =
                    "field-message error";

                return false;

            }


            if (valor.length > 500) {

                errorComentario.textContent =
                    "El comentario no puede superar los 500 caracteres.";

                errorComentario.className =
                    "field-message error";

                return false;

            }


            errorComentario.textContent =
                "Comentario válido.";

            errorComentario.className =
                "field-message success";


            return true;

        }



        /*
        ==============================================
        VALIDACIÓN EN TIEMPO REAL
        ==============================================
        */

        nombre.addEventListener(
            "input",
            validarNombre
        );


        correo.addEventListener(
            "input",
            validarCorreo
        );


        comentario.addEventListener(
            "input",
            function () {

                contadorComentario.textContent =
                    comentario.value.length;

                validarComentario();

            }
        );



        /*
        ==============================================
        ENVÍO
        ==============================================
        */

        formulario.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const nombreValido =
                    validarNombre();


                const correoValido =
                    validarCorreo();


                const comentarioValido =
                    validarComentario();


                if (
                    !nombreValido ||
                    !correoValido ||
                    !comentarioValido
                ) {

                    mensaje.textContent =
                        "Revisa los campos antes de enviar el mensaje.";

                    mensaje.className =
                        "form-message error";

                    return;

                }



                /*
                GUARDAR MENSAJE EN LOCALSTORAGE
                */

                let mensajes = [];


                try {

                    mensajes =
                        JSON.parse(
                            localStorage.getItem(
                                "mensajesContacto"
                            )
                        ) || [];

                } catch (error) {

                    mensajes = [];

                }



                mensajes.push({

                    id: Date.now(),

                    nombre:
                        nombre.value.trim(),

                    correo:
                        correo.value
                            .trim()
                            .toLowerCase(),

                    comentario:
                        comentario.value.trim(),

                    fecha:
                        new Date()
                            .toLocaleString(
                                "es-CL"
                            )

                });



                localStorage.setItem(
                    "mensajesContacto",
                    JSON.stringify(mensajes)
                );



                /*
                MENSAJE CORRECTO
                */

                mensaje.textContent =
                    "¡Mensaje enviado correctamente! Gracias por contactarnos.";

                mensaje.className =
                    "form-message success";



                formulario.reset();


                contadorComentario.textContent =
                    "0";


                errorNombre.textContent = "";
                errorCorreo.textContent = "";
                errorComentario.textContent = "";


                errorNombre.className =
                    "field-message";

                errorCorreo.className =
                    "field-message";

                errorComentario.className =
                    "field-message";

            }
        );


    }
);