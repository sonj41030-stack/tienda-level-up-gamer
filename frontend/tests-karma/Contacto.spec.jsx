import { render, screen, fireEvent } from '@testing-library/react'
import Contacto from '../src/pages/Contacto.jsx'

// Pruebas del formulario de contacto: validación, guardado y limpieza de campos.

const enviar = ({ nombre = '', email = '', mensaje = '' }) => {
  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: nombre } })
  fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: email } })
  fireEvent.change(screen.getByLabelText('Mensaje'), { target: { value: mensaje } })
  fireEvent.click(screen.getByRole('button', { name: 'Enviar' }))
}

const mensajesGuardados = () => JSON.parse(localStorage.getItem('lug_mensajes') || '[]')

describe('Página Contacto', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('con los campos vacíos muestra los tres errores y no guarda nada', () => {
    render(<Contacto />)
    enviar({})

    expect(screen.getByText('El nombre debe tener al menos 3 caracteres.')).toBeTruthy()
    expect(screen.getByText('Ingresa un correo válido.')).toBeTruthy()
    expect(screen.getByText('El mensaje debe tener al menos 10 caracteres.')).toBeTruthy()
    expect(mensajesGuardados()).toEqual([])
  })

  it('un mensaje demasiado corto muestra solo el error del mensaje', () => {
    render(<Contacto />)
    enviar({ nombre: 'Ana Pérez', email: 'ana@duoc.cl', mensaje: 'Hola' })

    expect(screen.getByText('El mensaje debe tener al menos 10 caracteres.')).toBeTruthy()
    expect(screen.queryByText('El nombre debe tener al menos 3 caracteres.')).toBeNull()
    expect(screen.queryByText('Ingresa un correo válido.')).toBeNull()
  })

  it('el mensaje necesita 10 caracteres como mínimo (se prueba el límite exacto)', () => {
    render(<Contacto />)
    enviar({ nombre: 'Ana Pérez', email: 'ana@duoc.cl', mensaje: 'Hola amig' }) // 9 caracteres
    expect(screen.getByText('El mensaje debe tener al menos 10 caracteres.')).toBeTruthy()
    expect(mensajesGuardados()).toEqual([])

    enviar({ nombre: 'Ana Pérez', email: 'ana@duoc.cl', mensaje: 'Hola amigo' }) // 10 caracteres
    expect(screen.queryByText('El mensaje debe tener al menos 10 caracteres.')).toBeNull()
    expect(mensajesGuardados().length).toBe(1)
  })

  it('con datos válidos guarda el mensaje, avisa el envío y limpia el formulario', () => {
    render(<Contacto />)
    enviar({ nombre: '  Ana Pérez ', email: 'ana@duoc.cl', mensaje: 'Quiero consultar por un producto' })

    expect(mensajesGuardados()).toEqual([
      {
        nombre: 'Ana Pérez',
        email: 'ana@duoc.cl',
        mensaje: 'Quiero consultar por un producto',
        fecha: jasmine.any(String),
      },
    ])
    expect(screen.getByText('¡Mensaje enviado! Te responderemos pronto.')).toBeTruthy()
    expect(screen.getByLabelText('Nombre').value).toBe('')
    expect(screen.getByLabelText('Mensaje').value).toBe('')
  })
})
