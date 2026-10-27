import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from './Footer.jsx'

const respuestaOk = {
  ok: true,
  json: () => Promise.resolve({ dolar: { valor: 981.86 }, euro: { valor: 1100.86 } }),
}

describe('Footer', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('48. muestra el texto de derechos reservados', () => {
    render(<Footer />)
    expect(screen.getByText('© 2026 Level-Up Gamer. Todos los derechos reservados.')).toBeInTheDocument()
  })

  it('49. mientras carga muestra un mensaje de espera', () => {
    render(<Footer />)
    expect(screen.getByText('Obteniendo valores del mercado...')).toBeInTheDocument()
  })

  it('50. consulta la API de indicadores económicos', () => {
    render(<Footer />)
    expect(fetch).toHaveBeenCalledWith('https://mindicador.cl/api')
  })

  it('51. con respuesta exitosa muestra dólar y euro formateados', async () => {
    fetch.mockResolvedValue(respuestaOk)
    render(<Footer />)

    const dolar = (981.86).toLocaleString('es-CL')
    const euro = (1100.86).toLocaleString('es-CL')
    expect(
      await screen.findByText(`Dólar (USD): $${dolar} CLP | Euro (EUR): $${euro} CLP`)
    ).toBeInTheDocument()
    expect(screen.queryByText('Obteniendo valores del mercado...')).not.toBeInTheDocument()
  })

  it('52. si la API responde con error muestra el aviso de no disponible', async () => {
    fetch.mockResolvedValue({ ok: false })
    render(<Footer />)
    expect(
      await screen.findByText('Indicadores económicos no disponibles temporalmente.')
    ).toBeInTheDocument()
  })

  it('53. si falla la conexión muestra el aviso de no disponible', async () => {
    fetch.mockRejectedValue(new Error('sin red'))
    render(<Footer />)
    expect(
      await screen.findByText('Indicadores económicos no disponibles temporalmente.')
    ).toBeInTheDocument()
  })
})