import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Login from '../src/pages/Login.jsx'

// Pruebas del formulario de inicio de sesión.
// MemoryRouter simula la navegación sin cambiar la URL real del navegador.

const usuario = { nombre: 'Ana Pérez', email: 'ana@duoc.cl', password: '123456', role: 'cliente' }

const renderLogin = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<h1>Página de inicio</h1>} />
      </Routes>
    </MemoryRouter>
  )

const ingresar = (email, password) => {
  fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: email } })
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: password } })
  fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
}

describe('Página Login', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('lug_users', JSON.stringify([usuario]))
  })

  it('muestra el título, los campos y el botón, sin errores al abrir', () => {
    renderLogin()
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeTruthy()
    expect(screen.getByLabelText('Correo Electrónico')).toBeTruthy()
    expect(screen.getByLabelText('Contraseña')).toBeTruthy()
    expect(screen.queryByText('Correo o contraseña incorrectos.')).toBeNull()
  })

  it('con una contraseña incorrecta muestra un error y no inicia sesión', () => {
    renderLogin()
    ingresar('ana@duoc.cl', 'clave-mala')

    expect(screen.getByText('Correo o contraseña incorrectos.')).toBeTruthy()
    expect(localStorage.getItem('lug_current_user')).toBeNull()
    expect(screen.queryByText('Página de inicio')).toBeNull()
  })

  it('con datos correctos guarda la sesión (sin la contraseña) y lleva al inicio', () => {
    renderLogin()
    ingresar('ana@duoc.cl', '123456')

    const sesion = JSON.parse(localStorage.getItem('lug_current_user'))
    expect(sesion).toEqual({ nombre: 'Ana Pérez', email: 'ana@duoc.cl', role: 'cliente' })
    expect(sesion.password).toBeUndefined()
    expect(screen.getByText('Página de inicio')).toBeTruthy()
  })

  it('si todavía no hay usuarios registrados rechaza el ingreso', () => {
    localStorage.removeItem('lug_users')
    renderLogin()
    ingresar('nadie@duoc.cl', '123456')

    expect(screen.getByText('Correo o contraseña incorrectos.')).toBeTruthy()
    expect(localStorage.getItem('lug_current_user')).toBeNull()
  })
})
