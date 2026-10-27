import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App.jsx'
import { CarritoProvider } from './context/CarritoContext.jsx'

vi.mock('./data/productos.js', () => ({
  productos: Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    nombre: `Producto ${i + 1}`,
    categoria: 'Pc',
    descripcion: `Descripción ${i + 1}`,
    precio: 10000 * (i + 1),
    imagen: `/p${i + 1}.png`,
    alt: `producto ${i + 1}`,
  })),
}))

vi.mock('./data/productos', () => ({
  productos: Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    nombre: `Producto ${i + 1}`,
    categoria: 'Pc',
    precio: 10000 * (i + 1),
  })),
}))

const renderEnRuta = (ruta) =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </MemoryRouter>
  )

describe('App (rutas)', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it.each([
    ['/', '¡Desafía tus límites con Level-Up Gamer!'],
    ['/productos', 'Nuestro Catálogo'],
    ['/carrito', 'Tu Carrito de Compras'],
    ['/login', 'Iniciar Sesión'],
    ['/registro', 'Registrar Usuario'],
    ['/contacto', 'Contacto'],
    ['/nosotros', 'Nuestra Historia'],
    ['/blogs', 'Novedades y Noticias'],
  ])('la ruta %s muestra su página (%s)', (ruta, titulo) => {
    renderEnRuta(ruta)
    expect(screen.getByRole('heading', { name: titulo })).toBeInTheDocument()
  })

  it('la ruta /admin muestra el panel a un administrador', () => {
    localStorage.setItem('lug_current_user', JSON.stringify({ nombre: 'Jefe', email: 'jefe@duoc.cl', role: 'admin' }))
    renderEnRuta('/admin')
    expect(screen.getByRole('heading', { name: 'Panel de Administración' })).toBeInTheDocument()
  })

  it('el Header y el Footer aparecen en todas las páginas', () => {
    renderEnRuta('/productos')
    expect(screen.getByText('GAMER')).toBeInTheDocument()
    expect(screen.getByText('© 2026 Level-Up Gamer. Todos los derechos reservados.')).toBeInTheDocument()
  })
})