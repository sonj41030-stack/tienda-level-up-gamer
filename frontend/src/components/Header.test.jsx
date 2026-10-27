import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header.jsx'
import { CarritoProvider } from '../context/CarritoContext.jsx'

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => navigateMock }
})

const renderHeader = () =>
  render(
    <MemoryRouter>
      <CarritoProvider>
        <Header />
      </CarritoProvider>
    </MemoryRouter>
  )

const iniciarSesion = (usuario) =>
  localStorage.setItem('lug_current_user', JSON.stringify(usuario))

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear()
    navigateMock.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('40. muestra la marca y los links de navegación', () => {
    renderHeader()
    expect(screen.getByText('GAMER')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Productos' })).toHaveAttribute('href', '/productos')
    expect(screen.getByRole('link', { name: 'Nosotros' })).toHaveAttribute('href', '/nosotros')
    expect(screen.getByRole('link', { name: 'Blogs' })).toHaveAttribute('href', '/blogs')
    expect(screen.getByRole('link', { name: 'Contacto' })).toHaveAttribute('href', '/contacto')
  })

  it('41. sin sesión muestra Iniciar sesión y Registrar usuario', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('link', { name: 'Registrar usuario' })).toHaveAttribute('href', '/registro')
    expect(screen.queryByText('Cerrar sesión')).not.toBeInTheDocument()
  })

  it('42. con sesión de cliente saluda por el primer nombre y muestra Mi Perfil', () => {
    iniciarSesion({ nombre: 'Ana Pérez', email: 'ana@duoc.cl', role: 'cliente' })
    renderHeader()
    expect(screen.getByText('Hola, Ana')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Mi Perfil' })).toHaveAttribute('href', '/perfil')
    expect(screen.queryByText('Panel Admin')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Iniciar sesión' })).not.toBeInTheDocument()
  })

  it('43. un usuario con rol admin ve el Panel Admin', () => {
    iniciarSesion({ nombre: 'Jefe Tienda', email: 'jefe@duoc.cl', role: 'admin' })
    renderHeader()
    expect(screen.getByRole('link', { name: 'Panel Admin' })).toHaveAttribute('href', '/admin')
    expect(screen.queryByText('Mi Perfil')).not.toBeInTheDocument()
  })

  it('44. el correo admin@duoc.cl también es administrador', () => {
    iniciarSesion({ nombre: 'Admin', email: 'admin@duoc.cl', role: 'cliente' })
    renderHeader()
    expect(screen.getByRole('link', { name: 'Panel Admin' })).toBeInTheDocument()
  })

  it('45. si no hay nombre, saluda con la parte del correo antes del @', () => {
    iniciarSesion({ email: 'pedro@duoc.cl' })
    renderHeader()
    expect(screen.getByText('Hola, pedro')).toBeInTheDocument()
  })

  it('46. el botón del carrito muestra la cantidad total de productos', () => {
    localStorage.setItem(
      'carrito',
      JSON.stringify([
        { id: 1, nombre: 'Polera', precio: 10000, cantidad: 2 },
        { id: 2, nombre: 'Mouse', precio: 5000, cantidad: 1 },
      ])
    )
    renderHeader()
    expect(screen.getByRole('link', { name: /Cart \(3\)/ })).toHaveAttribute('href', '/carrito')
  })

  it('47. cerrar sesión borra el usuario, avisa y vuelve al inicio', async () => {
    const alertaMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
    iniciarSesion({ nombre: 'Ana Pérez', email: 'ana@duoc.cl', role: 'cliente' })
    const user = userEvent.setup()
    renderHeader()

    await user.click(screen.getByText('Cerrar sesión'))

    expect(localStorage.getItem('lug_current_user')).toBeNull()
    expect(alertaMock).toHaveBeenCalledWith('Has cerrado sesión correctamente.')
    expect(navigateMock).toHaveBeenCalledWith('/')
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(screen.queryByText('Cerrar sesión')).not.toBeInTheDocument()
  })
})