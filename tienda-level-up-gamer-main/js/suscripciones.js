document.addEventListener('DOMContentLoaded', () => {
    const todosLosBotones = Array.from(document.querySelectorAll('button, input[type="submit"], a.btn'));
    
    const btnSuscribirse = todosLosBotones.find(btn => 
        btn.textContent.trim().toUpperCase().includes('SUSCRIBIRSE') || 
        btn.value?.toUpperCase().includes('SUSCRIBIRSE')
    ) || document.getElementById('btn-suscribirse');

    if (btnSuscribirse) {
        btnSuscribirse.addEventListener('click', (e) => {
            e.preventDefault();

            const contenedor = btnSuscribirse.closest('form, div, section') || document;
            const inputCorreo = contenedor.querySelector('input[type="email"], input[type="text"]');

            if (!inputCorreo) return;

            const correoVal = inputCorreo.value.trim();
            const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

            if (!correoVal) {
                alert('Por favor, ingresa tu correo electrónico.');
                return;
            }

            if (!regexEmail.test(correoVal)) {
                alert('Ingresa un correo electrónico válido.');
                return;
            }

            let suscriptores = JSON.parse(localStorage.getItem('lug_suscriptores')) || [];

            if (suscriptores.includes(correoVal)) {
                alert('Este correo electrónico ya se encuentra suscrito.');
                return;
            }

            suscriptores.push(correoVal);
            localStorage.setItem('lug_suscriptores', JSON.stringify(suscriptores));

            alert(`¡Suscripción exitosa! Te has suscrito con el correo: ${correoVal}`);
            inputCorreo.value = '';
        });
    }
});