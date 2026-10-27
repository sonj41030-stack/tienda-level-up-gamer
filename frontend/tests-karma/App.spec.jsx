import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App.jsx'
import { CarritoProvider } from '../src/context/CarritoContext.jsx'

// Prueba de integración: cada ruta de react-router muestra su página,
// siempre con el Header y el Footer alrededor.

const renderEnRuta = (ruta) =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </MemoryRouter>
  )

const rutas = [
  ['/', '¡Desafía tus límites con Level-Up Gamer!'],
  ['/productos', 'Nuestro Catálogo'],
  ['/nosotros', 'Nuestra Historia'],
  ['/blogs', 'Novedades y Noticias'],
  ['/carrito', 'Tu Carrito de Compras'],
  ['/login', 'Iniciar Sesión'],
  ['/registro', 'Registrar Usuario'],
  ['/contacto', 'Contacto'],
  ['/una-ruta-que-no-existe', 'Página no encontrada'],
]

describe('App (navegación entre páginas)', () => {
  beforeEach(() => {
    localStorage.clear()
    // El Footer llama a fetch; se deja "pendiente" para no salir a internet.
    spyOn(window, 'fetch').and.returnValue(new Promise(() => {}))
  })

  rutas.forEach(([ruta, titulo]) => {
    it(`la ruta ${ruta} muestra la página "${titulo}"`, () => {
      renderEnRuta(ruta)
      expect(screen.getByRole('heading', { name: titulo })).toBeTruthy()
    })
  })

  it('/perfil sin sesión manda a Iniciar Sesión y con sesión muestra el perfil', () => {
    const { unmount } = renderEnRuta('/perfil')
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeTruthy()
    unmount()

    localStorage.setItem('lug_current_user', JSON.stringify({ nombre: 'Ana Pérez', email: 'ana@duoc.cl', role: 'cliente' }))
    renderEnRuta('/perfil')
    expect(screen.getByRole('heading', { name: 'Mi Perfil LevelUp' })).toBeTruthy()
  })

  it('/admin solo muestra el panel a un administrador', () => {
    localStorage.setItem('lug_current_user', JSON.stringify({ nombre: 'Jefe', email: 'jefe@duoc.cl', role: 'admin' }))
    renderEnRuta('/admin')
    expect(screen.getByRole('heading', { name: 'Panel de Administración' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Panel Admin' })).toBeTruthy()
  })

  it('los enlaces Nosotros y Blogs del menú llevan a sus páginas', () => {
    renderEnRuta('/')
    fireEvent.click(screen.getByRole('link', { name: 'Nosotros' }))
    expect(screen.getByRole('heading', { name: 'Nuestra Historia' })).toBeTruthy()

    fireEvent.click(screen.getByRole('link', { name: 'Blogs' }))
    expect(screen.getByRole('heading', { name: 'Novedades y Noticias' })).toBeTruthy()
  })

  it('el Header y el Footer aparecen en todas las páginas', () => {
    renderEnRuta('/carrito')
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeTruthy()
    expect(screen.getByText('© 2026 Level-Up Gamer. Todos los derechos reservados.')).toBeTruthy()
  })
})
