// Pruebas de la página de Inicio (las del panel de administración están en Admin.spec.jsx).
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Inicio from '../src/pages/Inicio.jsx'
import { CarritoProvider } from '../src/context/CarritoContext.jsx'
import { productos } from '../src/data/productos.js'

describe('Página Inicio', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const renderInicio = () =>
    render(
      <MemoryRouter>
        <CarritoProvider>
          <Inicio />
        </CarritoProvider>
      </MemoryRouter>
    )

  it('muestra el banner y el botón que lleva al catálogo', () => {
    renderInicio()
    expect(screen.getByRole('heading', { name: '¡Desafía tus límites con Level-Up Gamer!' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Ver productos' }).getAttribute('href')).toBe('/productos')
    expect(screen.getByAltText('Banner Level-Up Gamer')).toBeTruthy()
  })

  it('muestra solo los 4 primeros productos como destacados', () => {
    renderInicio()
    const destacados = screen.getAllByRole('heading', { level: 4 }).map((h) => h.textContent)
    expect(destacados).toEqual(productos.slice(0, 4).map((p) => p.nombre))
    expect(screen.getAllByRole('button', { name: 'Añadir al carrito' }).length).toBe(4)
  })
})
