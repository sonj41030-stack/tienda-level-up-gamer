import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Registro from './Registro.jsx'

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => navigateMock }
})

const datosValidos = {
  run: '12345678-5',
  nombre: 'Ana',
  apellidos: 'Pérez',
  email: 'ana@duoc.cl',
  password: '1234',
  fechaNacimiento: '2000-05-10',
  region: 'Valparaíso',
  comuna: 'Viña del Mar',
  direccion: 'Av. Libertad 123',
}

const llenar = async (user, cambios = {}) => {
  const d = { ...datosValidos, ...cambios }
  if (d.run) await user.type(screen.getByLabelText('RUN'), d.run)
  if (d.nombre) await user.type(screen.getByLabelText('Nombre'), d.nombre)
  if (d.apellidos) await user.type(screen.getByLabelText('Apellidos'), d.apellidos)
  if (d.email) await user.type(screen.getByLabelText('Correo Electrónico'), d.email)
  if (d.password) await user.type(screen.getByLabelText('Contraseña'), d.password)
  if (d.fechaNacimiento) await user.type(screen.getByLabelText('Fecha de Nacimiento'), d.fechaNacimiento)
  if (d.region) await user.selectOptions(screen.getByLabelText('Región'), d.region)
  if (d.comuna) await user.selectOptions(screen.getByLabelText('Comuna'), d.comuna)
  if (d.direccion) await user.type(screen.getByLabelText('Dirección'), d.direccion)
  await user.click(screen.getByRole('button', { name: 'Registrarse' }))
}

const usuariosGuardados = () => JSON.parse(localStorage.getItem('lug_users') || '[]')

describe('Página Registro', () => {
  beforeEach(() => {
    localStorage.clear()
    navigateMock.mockClear()
  })

  it('28. muestra el título, los campos y el botón', () => {
    render(<Registro />)
    expect(screen.getByRole('heading', { name: 'Registrar Usuario' })).toBeInTheDocument()
    ;['RUN', 'Nombre', 'Apellidos', 'Correo Electrónico', 'Contraseña', 'Fecha de Nacimiento', 'Región', 'Comuna', 'Dirección'].forEach(
      (etiqueta) => expect(screen.getByLabelText(etiqueta)).toBeInTheDocument()
    )
    expect(screen.getByLabelText('Comuna')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Registrarse' })).toBeInTheDocument()
  })

  it('29. con los campos vacíos muestra los errores y no guarda nada', async () => {
    const user = userEvent.setup()
    render(<Registro />)
    await user.click(screen.getByRole('button', { name: 'Registrarse' }))

    expect(screen.getByText('Revisa los campos marcados.')).toBeInTheDocument()
    expect(screen.getByText('El RUN es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa un correo válido.')).toBeInTheDocument()
    expect(screen.getByText('Selecciona una región.')).toBeInTheDocument()
    expect(usuariosGuardados()).toEqual([])
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('30. rechaza un RUN con dígito verificador incorrecto', async () => {
    const user = userEvent.setup()
    render(<Registro />)
    await llenar(user, { run: '12345678-9' })

    expect(screen.getByText('El RUN no es válido.')).toBeInTheDocument()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('31. rechaza un correo que ya está registrado', async () => {
    localStorage.setItem('lug_users', JSON.stringify([{ nombre: 'Ana', email: 'ana@duoc.cl', run: '76543216' }]))
    const user = userEvent.setup()
    render(<Registro />)
    await llenar(user)

    expect(screen.getByText('Ese correo ya está registrado.')).toBeInTheDocument()
    expect(usuariosGuardados()).toHaveLength(1)
  })

  it('32. con datos válidos guarda el usuario como cliente', async () => {
    const user = userEvent.setup()
    render(<Registro />)
    await llenar(user)

    expect(usuariosGuardados()).toEqual([
      {
        run: '123456785',
        nombre: 'Ana Pérez',
        email: 'ana@duoc.cl',
        password: '1234',
        fechaNacimiento: '2000-05-10',
        region: 'Valparaíso',
        comuna: 'Viña del Mar',
        direccion: 'Av. Libertad 123',
        role: 'cliente',
        puntos: 0,
        codigoReferido: expect.stringMatching(/^LUG-\d{4}$/),
      },
    ])
  })

  it('33. con datos válidos navega a /login y no muestra errores', async () => {
    const user = userEvent.setup()
    render(<Registro />)
    await llenar(user)

    expect(navigateMock).toHaveBeenCalledWith('/login')
    expect(screen.queryByText('Revisa los campos marcados.')).not.toBeInTheDocument()
  })
})
