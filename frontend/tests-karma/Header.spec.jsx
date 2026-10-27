import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Header from '../src/components/Header.jsx'
import Login from '../src/pages/Login.jsx'
import { CarritoProvider } from '../src/context/CarritoContext.jsx'

// Pruebas del menú: cambia según la sesión guardada y el contenido del carrito.

const renderHeader = (rutaInicial = '/productos') =>
  render(
    <MemoryRouter initialEntries={[rutaInicial]}>
      <CarritoProvider>
        <Header />
        <Routes>
          <Route path="/" element={<h1>Página de inicio</h1>} />
          <Route path="/productos" element={<h1>Página de productos</h1>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </CarritoProvider>
    </MemoryRouter>
  )

const iniciarSesion = (usuario) =>
  localStorage.setItem('lug_current_user', JSON.stringify(usuario))

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra los enlaces principales de navegación', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: 'Home' }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('link', { name: 'Productos' }).getAttribute('href')).toBe('/productos')
    expect(screen.getByRole('link', { name: 'Contacto' }).getAttribute('href')).toBe('/contacto')
  })

  it('sin sesión ofrece Iniciar sesión y Registrar usuario', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Registrar usuario' })).toBeTruthy()
    expect(screen.queryByText('Cerrar sesión')).toBeNull()
  })

  it('con sesión de cliente saluda por el primer nombre y muestra Mi Perfil', () => {
    iniciarSesion({ nombre: 'Ana Pérez', email: 'ana@duoc.cl', role: 'cliente' })
    renderHeader()
    expect(screen.getByText('Hola, Ana')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Mi Perfil' })).toBeTruthy()
    expect(screen.queryByText('Panel Admin')).toBeNull()
  })

  it('si el usuario no tiene nombre, saluda con la parte del correo antes de @', () => {
    iniciarSesion({ email: 'pedro@duoc.cl', role: 'cliente' })
    renderHeader()
    expect(screen.getByText('Hola, pedro')).toBeTruthy()
  })

  it('un administrador ve el enlace al Panel Admin', () => {
    iniciarSesion({ nombre: 'Jefe Tienda', email: 'jefe@duoc.cl', role: 'admin' })
    renderHeader()
    expect(screen.getByRole('link', { name: 'Panel Admin' }).getAttribute('href')).toBe('/admin')
    expect(screen.queryByText('Mi Perfil')).toBeNull()
  })

  it('el botón del carrito muestra la suma de unidades', () => {
    localStorage.setItem(
      'carrito',
      JSON.stringify([
        { id: 1, nombre: 'Polera', precio: 10000, cantidad: 2 },
        { id: 2, nombre: 'Mouse', precio: 5000, cantidad: 1 },
      ])
    )
    renderHeader()
    expect(screen.getByRole('link', { name: /Cart \(3\)/ })).toBeTruthy()
  })

  it('cerrar sesión borra el usuario, avisa con alert y vuelve al inicio', () => {
    // spyOn reemplaza window.alert para que no aparezca la ventana real.
    const alerta = spyOn(window, 'alert')
    iniciarSesion({ nombre: 'Ana Pérez', email: 'ana@duoc.cl', role: 'cliente' })
    renderHeader()

    fireEvent.click(screen.getByText('Cerrar sesión'))

    expect(alerta).toHaveBeenCalledOnceWith('Has cerrado sesión correctamente.')
    expect(localStorage.getItem('lug_current_user')).toBeNull()
    expect(screen.getByText('Página de inicio')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeTruthy()
  })

  it('después de iniciar sesión el menú se actualiza sin recargar la página', () => {
    localStorage.setItem(
      'lug_users',
      JSON.stringify([{ nombre: 'Ana Pérez', email: 'ana@duoc.cl', password: '123456', role: 'cliente' }])
    )
    renderHeader('/login')
    expect(screen.queryByText('Hola, Ana')).toBeNull()

    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'ana@duoc.cl' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(screen.getByText('Página de inicio')).toBeTruthy()
    expect(screen.getByText('Hola, Ana')).toBeTruthy()
  })
})
