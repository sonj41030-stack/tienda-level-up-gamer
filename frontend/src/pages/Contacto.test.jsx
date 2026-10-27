import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contacto from './Contacto.jsx'

const llenar = async (user, { nombre = '', email = '', mensaje = '' }) => {
  if (nombre) await user.type(screen.getByLabelText('Nombre'), nombre)
  if (email) await user.type(screen.getByLabelText('Correo Electrónico'), email)
  if (mensaje) await user.type(screen.getByLabelText('Mensaje'), mensaje)
  await user.click(screen.getByRole('button', { name: 'Enviar' }))
}

const mensajesGuardados = () => JSON.parse(localStorage.getItem('lug_mensajes') || '[]')

describe('Página Contacto', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('34. muestra el título, los tres campos y el botón', () => {
    render(<Contacto />)
    expect(screen.getByRole('heading', { name: 'Contacto' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Mensaje')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument()
  })

  it('35. con los campos vacíos muestra los tres errores y no guarda nada', async () => {
    const user = userEvent.setup()
    render(<Contacto />)
    await llenar(user, {})

    expect(screen.getByText('El nombre debe tener al menos 3 caracteres.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa un correo válido.')).toBeInTheDocument()
    expect(screen.getByText('El mensaje debe tener al menos 10 caracteres.')).toBeInTheDocument()
    expect(mensajesGuardados()).toEqual([])
  })

  it('36. un mensaje demasiado corto muestra solo el error del mensaje', async () => {
    const user = userEvent.setup()
    render(<Contacto />)
    await llenar(user, { nombre: 'Ana Pérez', email: 'ana@duoc.cl', mensaje: 'Hola' })

    expect(screen.getByText('El mensaje debe tener al menos 10 caracteres.')).toBeInTheDocument()
    expect(screen.queryByText(/al menos 3 caracteres/)).not.toBeInTheDocument()
    expect(screen.queryByText('Ingresa un correo válido.')).not.toBeInTheDocument()
    expect(mensajesGuardados()).toEqual([])
  })

  it('37. con datos válidos guarda el mensaje con su fecha', async () => {
    const user = userEvent.setup()
    render(<Contacto />)
    await llenar(user, {
      nombre: '  Ana Pérez  ',
      email: 'ana@duoc.cl',
      mensaje: 'Quiero consultar por un producto',
    })

    expect(mensajesGuardados()).toEqual([
      {
        nombre: 'Ana Pérez',
        email: 'ana@duoc.cl',
        mensaje: 'Quiero consultar por un producto',
        fecha: expect.any(String),
      },
    ])
  })

  it('38. con datos válidos muestra el aviso de éxito y limpia los campos', async () => {
    const user = userEvent.setup()
    render(<Contacto />)
    await llenar(user, {
      nombre: 'Ana Pérez',
      email: 'ana@duoc.cl',
      mensaje: 'Quiero consultar por un producto',
    })

    expect(screen.getByText('¡Mensaje enviado! Te responderemos pronto.')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toHaveValue('')
    expect(screen.getByLabelText('Correo Electrónico')).toHaveValue('')
    expect(screen.getByLabelText('Mensaje')).toHaveValue('')
  })

  it('39. un nuevo envío inválido oculta el aviso de éxito anterior', async () => {
    const user = userEvent.setup()
    render(<Contacto />)
    await llenar(user, {
      nombre: 'Ana Pérez',
      email: 'ana@duoc.cl',
      mensaje: 'Quiero consultar por un producto',
    })
    expect(screen.getByText('¡Mensaje enviado! Te responderemos pronto.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(screen.queryByText('¡Mensaje enviado! Te responderemos pronto.')).not.toBeInTheDocument()
    expect(screen.getByText('El nombre debe tener al menos 3 caracteres.')).toBeInTheDocument()
    expect(mensajesGuardados()).toHaveLength(1)
  })
})