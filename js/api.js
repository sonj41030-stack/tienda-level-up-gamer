document.addEventListener('DOMContentLoaded', () => {
    const contenedorIndicadores = document.getElementById('indicadores-container');

    if (contenedorIndicadores) {
        fetch('https://mindicador.cl/api')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al conectar con la API');
                }
                return response.json();
            })
            .then(data => {
                const valorDolar = data.dolar.valor.toLocaleString('es-CL');
                const valorEuro = data.euro.valor.toLocaleString('es-CL');
                
                contenedorIndicadores.innerHTML = `
                    <span><strong>Dólar (USD):</strong> $${valorDolar} CLP</span> &nbsp;|&nbsp; 
                    <span><strong>Euro (EUR):</strong> $${valorEuro} CLP</span>
                `;
            })
            .catch(error => {
                console.error('Error de API:', error);
                contenedorIndicadores.innerHTML = `
                    <span style="color: var(--text-secondary);">Indicadores económicos no disponibles temporalmente.</span>
                `;
            });
    }
});