const regionesYComunas = {
    "Región Metropolitana": ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto", "La Florida", "Ñuñoa", "San Bernardo"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Concón", "Quilpué", "Villa Alemana", "San Antonio"],
    "Biobío": ["Concepción", "Talcahuano", "San Pedro de la Paz", "Chiguayante", "Los Ángeles"],
    "Antofagasta": ["Antofagasta", "Calama", "Tocopilla"],
    "Araucanía": ["Temuco", "Padre Las Casas", "Villarrica", "Pucón"],
    "Coquimbo": ["La Serena", "Coquimbo", "Ovalle"]
};

document.addEventListener('DOMContentLoaded', () => {
    initRegionComunaSelector();
    initRegistroForm();
});

function initRegionComunaSelector() {
    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna');

    if (!regionSelect || !comunaSelect) return;

    regionSelect.innerHTML = '<option value="">Seleccione una región</option>';
    Object.keys(regionesYComunas).forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });

    regionSelect.addEventListener('change', (e) => {
        const regionSeleccionada = e.target.value;
        comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';

        if (regionSeleccionada && regionesYComunas[regionSeleccionada]) {
            comunaSelect.disabled = false;
            regionesYComunas[regionSeleccionada].forEach(comuna => {
                const option = document.createElement('option');
                option.value = comuna;
                option.textContent = comuna;
                comunaSelect.appendChild(option);
            });
        } else {
            comunaSelect.disabled = true;
            comunaSelect.innerHTML = '<option value="">Primero seleccione una región</option>';
        }
    });
}

function initRegistroForm() {
    const formRegistro = document.getElementById('registroForm');

    if (!formRegistro) return;

    formRegistro.addEventListener('submit', (e) => {
        e.preventDefault();

        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

        const run = document.getElementById('run').value.trim();
        const nombre = document.getElementById('nombre').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const email = document.getElementById('correo').value.trim();
        const password = document.getElementById('password').value;
        const fechaNacimiento = document.getElementById('fechaNacimiento').value;
        const region = document.getElementById('region').value;
        const comuna = document.getElementById('comuna').value;
        const direccion = document.getElementById('direccion').value.trim();
        const refCode = document.getElementById('codigo-referido').value.trim();

        let isValid = true;

        if (!run) { document.getElementById('errorRun').textContent = 'El RUN es obligatorio.'; isValid = false; }
        if (!nombre) { document.getElementById('errorNombre').textContent = 'El nombre es obligatorio.'; isValid = false; }
        if (!apellidos) { document.getElementById('errorApellidos').textContent = 'Los apellidos son obligatorios.'; isValid = false; }
        if (!email) { document.getElementById('errorCorreo').textContent = 'El correo es obligatorio.'; isValid = false; }
        if (!password || password.length < 4 || password.length > 10) { 
            document.getElementById('errorPassword').textContent = 'La contraseña debe tener entre 4 y 10 caracteres.'; 
            isValid = false; 
        }
        if (!fechaNacimiento) { document.getElementById('errorFecha').textContent = 'Selecciona tu fecha de nacimiento.'; isValid = false; }
        if (!region) { document.getElementById('errorRegion').textContent = 'Selecciona una región.'; isValid = false; }
        if (!comuna) { document.getElementById('errorComuna').textContent = 'Selecciona una comuna.'; isValid = false; }
        if (!direccion) { document.getElementById('errorDireccion').textContent = 'La dirección es obligatoria.'; isValid = false; }

        if (!isValid) return;

        const userData = {
            id: Date.now().toString(),
            run,
            nombre: `${nombre} ${apellidos}`,
            email,
            password,
            fechaNacimiento,
            region,
            comuna,
            direccion,
            refCodeUsed: refCode
        };

        if (typeof registerUserWithReferral === 'function') {
            const result = registerUserWithReferral(userData);
            alert(result.message);
            if (result.success) {
                window.location.href = 'perfil.html';
            }
        } else {
            let users = JSON.parse(localStorage.getItem('lug_users')) || [];
            users.push(userData);
            localStorage.setItem('lug_users', JSON.stringify(users));
            localStorage.setItem('lug_current_user', JSON.stringify(userData));
            alert('¡Registro exitoso!');
            window.location.href = 'perfil.html';
        }
    });
}