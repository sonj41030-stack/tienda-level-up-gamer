document.addEventListener('DOMContentLoaded', () => {
    const formRegistro = document.getElementById('form-registro');
    const formLogin = document.getElementById('form-login');

    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; 
    const regexNombre = /^[a-zA-ZÀ-ÿ\s]{3,40}$/;

    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('reg-nombre').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-password').value.trim();

            if (!regexNombre.test(nombre)) {
                alert('El nombre debe tener al menos 3 letras y no contener números.');
                return;
            }
            if (!regexEmail.test(email)) {
                alert('Por favor, ingresa un correo electrónico válido.');
                return;
            }
            if (!regexPassword.test(password)) {
                alert('La contraseña debe tener mínimo 8 caracteres, incluyendo letras y números.');
                return;
            }

            alert('¡Registro exitoso! Tus datos son válidos.');
            formRegistro.reset();
        });
    }

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('log-email').value.trim();
            const password = document.getElementById('log-password').value.trim();

            if (!regexEmail.test(email) || !regexPassword.test(password)) {
                alert('Correo o contraseña con formato inválido.');
                return;
            }

            alert('¡Inicio de sesión correcto!');
            formLogin.reset();
        });
    }
});