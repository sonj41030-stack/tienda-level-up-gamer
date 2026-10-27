import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Registro from '../src/pages/Registro.jsx'

// Pruebas del formulario de registro: validaciones, región/comuna y código de referido.

const renderRegistro = () =>
  render(
    <MemoryRouter initialEntries={['/registro']}>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<h1>Página de login</h1>} />
      </Routes>
    </MemoryRouter>
  )

const datosValidos = {
  run: '12.345.678-5',
  nombre: 'Ana',
  apellidos: 'Pérez Soto',
  email: 'ana@duoc.cl',
  password: '1234',
  fechaNacimiento: '2000-05-10',
  region: 'Valparaíso',
  comuna: 'Viña del Mar',
  direccion: 'Av. Libertad 123',
  referido: '',
}

const etiquetas = {
  run: 'RUN',
  nombre: 'Nombre',
  apellidos: 'Apellidos',
  email: 'Correo Electrónico',
  password: 'Contraseña',
  fechaNacimiento: 'Fecha de Nacimiento',
  region: 'Región',
  comuna: 'Comuna',
  direccion: 'Dirección',
  referido: 'Código de referido (opcional)',
}

const escribir = (campo, valor) =>
  fireEvent.change(screen.getByLabelText(etiquetas[campo]), { target: { value: valor } })

// Llena el formulario con datos válidos, reemplazando los que se indiquen, y lo envía.
const registrar = (cambios = {}) => {
  const datos = { ...datosValidos, ...cambios }
  Object.keys(etiquetas).forEach((campo) => escribir(campo, datos[campo]))
  fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }))
}

const usuariosGuardados = () => JSON.parse(localStorage.getItem('lug_users') || '[]')
const guardarUsuarios = (usuarios) => localStorage.setItem('lug_users', JSON.stringify(usuarios))

const ana = { nombre: 'Ana', email: 'ana@duoc.cl', run: '123456785', puntos: 100, codigoReferido: 'LUG-1111' }

describe('Página Registro', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('con el formulario vacío marca todos los campos obligatorios y no guarda nada', () => {
    renderRegistro()
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }))

    expect(screen.getByText('Revisa los campos marcados.')).toBeTruthy()
    ;[
      'El RUN es obligatorio.',
      'El nombre es obligatorio.',
      'Los apellidos son obligatorios.',
      'Ingresa un correo válido.',
      'La contraseña debe tener entre 4 y 10 caracteres.',
      'Selecciona tu fecha de nacimiento.',
      'Selecciona una región.',
      'Selecciona una comuna.',
      'La dirección es obligatoria.',
    ].forEach((mensaje) => expect(screen.getByText(mensaje)).toBeTruthy())
    expect(usuariosGuardados()).toEqual([])
  })

  it('rechaza un RUN con dígito verificador incorrecto y marca solo ese campo', () => {
    renderRegistro()
    registrar({ run: '12345678-9' })

    expect(screen.getByText('El RUN no es válido.')).toBeTruthy()
    expect(screen.getByLabelText('RUN').className).toContain('is-invalid')
    expect(screen.getByLabelText('Nombre').className).not.toContain('is-invalid')
  })

  it('rechaza un RUN o un correo que ya están registrados', () => {
    guardarUsuarios([ana])
    renderRegistro()
    registrar({ email: 'ana@duoc.cl' })

    expect(screen.getByText('Ese RUN ya está registrado.')).toBeTruthy()
    expect(screen.getByText('Ese correo ya está registrado.')).toBeTruthy()
    expect(usuariosGuardados().length).toBe(1)
  })

  it('valida el formato del correo y el largo de la contraseña (4 a 10)', () => {
    renderRegistro()
    registrar({ email: 'correo-malo', password: '12345678901' })

    expect(screen.getByText('Ingresa un correo válido.')).toBeTruthy()
    expect(screen.getByText('La contraseña debe tener entre 4 y 10 caracteres.')).toBeTruthy()
  })

  it('no acepta una fecha de nacimiento futura', () => {
    renderRegistro()
    registrar({ fechaNacimiento: '2999-01-01' })
    expect(screen.getByText('La fecha no puede ser posterior a hoy.')).toBeTruthy()
  })

  it('la comuna se habilita al elegir región y muestra solo las comunas de esa región', () => {
    renderRegistro()
    const comuna = screen.getByLabelText('Comuna')
    expect(comuna.disabled).toBeTrue()

    escribir('region', 'Coquimbo')

    expect(comuna.disabled).toBeFalse()
    const opciones = Array.from(comuna.options).map((o) => o.value)
    expect(opciones).toEqual(['', 'La Serena', 'Coquimbo', 'Ovalle'])
  })

  it('al cambiar de región se borra la comuna elegida y obliga a elegir otra', () => {
    renderRegistro()
    escribir('region', 'Coquimbo')
    escribir('comuna', 'Ovalle')
    expect(screen.getByLabelText('Comuna').value).toBe('Ovalle')

    escribir('region', 'Biobío')
    expect(screen.getByLabelText('Comuna').value).toBe('')

    // Se envía sin volver a elegir comuna: no debe guardarse "Biobío + Ovalle".
    ;['run', 'nombre', 'apellidos', 'email', 'password', 'fechaNacimiento', 'direccion'].forEach((campo) =>
      escribir(campo, datosValidos[campo])
    )
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }))
    expect(screen.getByText('Selecciona una comuna.')).toBeTruthy()
    expect(usuariosGuardados()).toEqual([])
  })

  it('con datos válidos guarda el usuario completo y lleva al login', () => {
    renderRegistro()
    // Se fija Math.random para que el código generado sea siempre el mismo.
    spyOn(Math, 'random').and.returnValue(0.5)
    registrar()

    expect(usuariosGuardados()).toEqual([
      {
        run: '123456785',
        nombre: 'Ana Pérez Soto',
        email: 'ana@duoc.cl',
        password: '1234',
        fechaNacimiento: '2000-05-10',
        region: 'Valparaíso',
        comuna: 'Viña del Mar',
        direccion: 'Av. Libertad 123',
        role: 'cliente',
        puntos: 0,
        codigoReferido: 'LUG-5500',
      },
    ])
    expect(screen.getByText('Página de login')).toBeTruthy()
  })

  it('rechaza un código de referido que no existe', () => {
    renderRegistro()
    registrar({ referido: 'LUG-9999' })

    expect(screen.getByText('El código de referido no existe.')).toBeTruthy()
    expect(usuariosGuardados()).toEqual([])
  })

  it('con un código válido: quien invitó gana 500 puntos y el nuevo usuario parte con 200', () => {
    guardarUsuarios([{ ...ana, email: 'amigo@duoc.cl', run: '76543216' }])
    renderRegistro()
    // Se escribe en minúsculas y con espacios para comprobar que igual se reconoce.
    registrar({ referido: ' lug-1111 ' })

    const [invitador, nuevo] = usuariosGuardados()
    expect(invitador.puntos).toBe(600)
    expect(nuevo.puntos).toBe(200)
    expect(nuevo.codigoReferido).not.toBe('LUG-1111')
  })

  it('si quien invitó no tenía puntos guardados, parte de 0 y recibe 500', () => {
    guardarUsuarios([{ nombre: 'Amigo', email: 'amigo@duoc.cl', codigoReferido: 'LUG-2222' }])
    renderRegistro()
    registrar({ referido: 'LUG-2222' })

    expect(usuariosGuardados()[0].puntos).toBe(500)
  })

  it('si el código generado ya existe, genera otro distinto', () => {
    guardarUsuarios([{ nombre: 'Amigo', email: 'amigo@duoc.cl', codigoReferido: 'LUG-5500' }])
    renderRegistro()
    // Primero devuelve 0.5 (LUG-5500, ya existe) y luego 0.1 (LUG-1900).
    // Después usa el Math.random real, porque React Router también lo ocupa al navegar.
    const randomReal = Math.random
    const valores = [0.5, 0.1]
    spyOn(Math, 'random').and.callFake(() => (valores.length ? valores.shift() : randomReal()))
    registrar()

    expect(usuariosGuardados()[1].codigoReferido).toBe('LUG-1900')
  })
})
