import { render, screen } from '@testing-library/react'
import Footer from '../src/components/Footer.jsx'

// Pruebas del pie de página, que consulta una API externa (mindicador.cl).
// Se usa un MOCK de fetch para no depender de internet y poder simular
// una respuesta correcta, una respuesta con error y una caída de la red.

const respuestaApi = (datos, ok = true) => ({
  ok,
  json: jasmine.createSpy('json').and.returnValue(Promise.resolve(datos)),
})

describe('Footer', () => {
  it('mientras espera la respuesta muestra un mensaje de carga', () => {
    spyOn(window, 'fetch').and.returnValue(new Promise(() => {}))
    render(<Footer />)
    expect(screen.getByText('Obteniendo valores del mercado...')).toBeTruthy()
    expect(screen.getByText('© 2026 Level-Up Gamer. Todos los derechos reservados.')).toBeTruthy()
  })

  it('consulta la API de indicadores económicos una sola vez', () => {
    spyOn(window, 'fetch').and.returnValue(new Promise(() => {}))
    render(<Footer />)
    expect(window.fetch).toHaveBeenCalledOnceWith('https://mindicador.cl/api')
  })

  it('con una respuesta correcta muestra el dólar y el euro formateados', async () => {
    const respuesta = respuestaApi({ dolar: { valor: 981.86 }, euro: { valor: 1100.86 } })
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(respuesta))
    render(<Footer />)

    const dolar = (981.86).toLocaleString('es-CL')
    const euro = (1100.86).toLocaleString('es-CL')
    expect(
      await screen.findByText(`Dólar (USD): $${dolar} CLP | Euro (EUR): $${euro} CLP`)
    ).toBeTruthy()
    expect(respuesta.json).toHaveBeenCalled()
  })

  it('si la API responde con error muestra que no hay indicadores', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(respuestaApi({}, false)))
    render(<Footer />)
    expect(await screen.findByText('Indicadores económicos no disponibles temporalmente.')).toBeTruthy()
  })

  it('si no hay conexión muestra que no hay indicadores', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('sin red')))
    render(<Footer />)
    expect(await screen.findByText('Indicadores económicos no disponibles temporalmente.')).toBeTruthy()
  })
})
