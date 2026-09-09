const formLogin = document.getElementById('loginForm');

function mostrarError(idInput, idError, mensaje) {
    const input = document.getElementById(idInput);
    if (input) {
        input.classList.remove('input-success');
        input.classList.add('input-error');
    }
    const errElem = document.getElementById(idError);
    if (errElem) errElem.textContent = mensaje;
}

function mostrarExito(idInput, idError) {
    const input = document.getElementById(idInput);
    if (input) {
        input.classList.remove('input-error');
        input.classList.add('input-success');
    }
    const errElem = document.getElementById(idError);
    if (errElem) errElem.textContent = "";
}

if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        let formValido = true;

        const correoInput = document.getElementById('loginCorreo').value.trim();
        const regexCorreo = /^[a-zA-Z0-9._-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        
        if (!correoInput) {
            mostrarError('loginCorreo', 'errorLoginCorreo', 'El correo es requerido.');
            formValido = false;
        } else if (!regexCorreo.test(correoInput)) {
            mostrarError('loginCorreo', 'errorLoginCorreo', 'Correo no válido o no autorizado.');
            formValido = false;
        } else {
            mostrarExito('loginCorreo', 'errorLoginCorreo');
        }

        const passInput = document.getElementById('loginPassword').value.trim();
        if (!passInput) {
            mostrarError('loginPassword', 'errorLoginPassword', 'Debe ingresar su contraseña.');
            formValido = false;
        } else {
            mostrarExito('loginPassword', 'errorLoginPassword');
        }

        if (formValido) {
            if (correoInput === 'admin@duoc.cl' && passInput === 'admin123') {
                localStorage.setItem('lug_current_user', JSON.stringify({
                    nombre: 'Administrador',
                    email: 'admin@duoc.cl',
                    role: 'admin'
                }));
                alert("¡Bienvenido al Panel de Administración!");
                window.location.href = "admin.html";
                return;
            }

            const users = JSON.parse(localStorage.getItem('lug_users')) || [];
            const userFound = users.find(u => (u.email === correoInput || u.correo === correoInput) && u.password === passInput);

            if (userFound) {
                localStorage.setItem('lug_current_user', JSON.stringify(userFound));
                alert(`¡Sesión iniciada con éxito! Bienvenido, ${userFound.nombre}.`);
                window.location.href = "../index.html";
            } else if (users.length === 0) {
                localStorage.setItem('lug_current_user', JSON.stringify({
                    nombre: correoInput.split('@')[0],
                    email: correoInput
                }));
                alert("¡Sesión iniciada con éxito! Redirigiendo al inicio...");
                window.location.href = "../index.html";
            } else {
                mostrarError('loginPassword', 'errorLoginPassword', 'Correo o contraseña incorrectos.');
            }
        }
    });
}