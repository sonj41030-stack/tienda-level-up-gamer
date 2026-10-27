import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from './Login.jsx'

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => navigateMock }
})

const usuario = { nombre: 'Ana Pérez', email: 'ana@duoc.cl', password: '123456', role: 'cliente' }

const completar = async (user, email, password) => {
  await user.type(screen.getByLabelText('Correo Electrónico'), email)
  await user.type(screen.getByLabelText('Contraseña'), password)
  await user.click(screen.getByRole('button', { name: 'Ingresar' }))
}

describe('Página Login', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('lug_users', JSON.stringify([usuario]))
    navigateMock.mockClear()
  })

  it('23. muestra el título, los campos y el botón', () => {
    render(<Login />)
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument()
    expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument()
  })

  it('24. no muestra errores al abrir la página', () => {
    render(<Login />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('25. con datos incorrectos muestra un error y no inicia sesión', async () => {
    const user = userEvent.setup()
    render(<Login />)
    await completar(user, 'ana@duoc.cl', 'clave-mala')

    expect(screen.getByText('Correo o contraseña incorrectos.')).toBeInTheDocument()
    expect(localStorage.getItem('lug_current_user')).toBeNull()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('26. con datos correctos guarda la sesión sin la contraseña', async () => {
    const user = userEvent.setup()
    render(<Login />)
    await completar(user, 'ana@duoc.cl', '123456')

    const sesion = JSON.parse(localStorage.getItem('lug_current_user'))
    expect(sesion).toEqual({ nombre: 'Ana Pérez', email: 'ana@duoc.cl', role: 'cliente' })
    expect(sesion).not.toHaveProperty('password')
  })

  it('27. con datos correctos redirige al inicio', async () => {
    const user = userEvent.setup()
    render(<Login />)
    await completar(user, 'ana@duoc.cl', '123456')
    expect(navigateMock).toHaveBeenCalledWith('/')
  })
})

describe('Página Login sin usuarios registrados', () => {
  beforeEach(() => {
    localStorage.clear()
    navigateMock.mockClear()
  })

  it('76. si no hay usuarios guardados, rechaza el ingreso', async () => {
    const user = userEvent.setup()
    render(<Login />)
    await completar(user, 'nadie@duoc.cl', '123456')

    expect(screen.getByText('Correo o contraseña incorrectos.')).toBeInTheDocument()
    expect(localStorage.getItem('lug_current_user')).toBeNull()
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
