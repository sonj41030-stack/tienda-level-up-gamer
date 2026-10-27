import { useEffect, useState } from 'react'

export default function Footer() {
  const [indicadores, setIndicadores] = useState('Obteniendo valores del mercado...')

  useEffect(() => {
    fetch('https://mindicador.cl/api')
      .then((res) => {
        if (!res.ok) throw new Error('Error al conectar con la API')
        return res.json()
      })
      .then((data) => {
        const dolar = data.dolar.valor.toLocaleString('es-CL')
        const euro = data.euro.valor.toLocaleString('es-CL')
        setIndicadores(`Dólar (USD): $${dolar} CLP | Euro (EUR): $${euro} CLP`)
      })
      .catch(() => setIndicadores('Indicadores económicos no disponibles temporalmente.'))
  }, [])

  return (
    <footer>
      <div className="footer-content">
        <div style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'var(--accent-green)' }}>
          {indicadores}
        </div>
        <p>© 2026 Level-Up Gamer. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
