import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Admin from '../src/pages/Admin.jsx'
import { productos } from '../src/data/productos.js'

// Pruebas del panel de administración: acceso restringido, estadísticas y acciones.

const renderAdmin = () =>
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<h1>Página de login</h1>} />
      </Routes>
    </MemoryRouter>
  )

const guardar = (clave, valor) => localStorage.setItem(clave, JSON.stringify(valor))
const leer = (clave) => JSON.parse(localStorage.getItem(clave))
const abrirPestana = (nombre) => fireEvent.click(screen.getByRole('tab', { name: nombre }))

const datosDePrueba = () => {
  guardar('lug_users', [
    { nombre: 'Ana Pérez', email: 'ana@duoc.cl', puntos: 1200, codigoReferido: 'LUG-1111' },
    { nombre: 'Pedro Soto', email: 'pedro@duoc.cl' },
  ])
  guardar('lug_orders', [
    { id: 'ORD-000001', cliente: 'Ana Pérez', total: 30000, estado: 'Pendiente' },
    { id: 'ORD-000002', cliente: 'Invitado', total: 15000, estado: 'Completado' },
  ])
  guardar('lug_mensajes', [
    { nombre: 'Carlos', email: 'carlos@mail.com', mensaje: 'Consulta por stock', fecha: '2026-09-01T10:00:00Z' },
    { nombre: 'María', email: 'maria@mail.com', mensaje: 'Gracias', fecha: '2026-09-02T10:00:00Z', estado: 'Leído' },
  ])
}

describe('Página Admin (acceso)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('sin sesión iniciada redirige al login', () => {
    renderAdmin()
    expect(screen.getByText('Página de login')).toBeTruthy()
  })

  it('un cliente ve un aviso de que no tiene permisos', () => {
    guardar('lug_current_user', { nombre: 'Ana', email: 'ana@duoc.cl', role: 'cliente' })
    renderAdmin()
    expect(screen.getByText('No tienes permisos para ver el panel de administración.')).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Panel de Administración' })).toBeNull()
  })

  it('el correo admin@duoc.cl tiene acceso aunque su rol sea cliente', () => {
    guardar('lug_current_user', { email: 'admin@duoc.cl', role: 'cliente' })
    renderAdmin()
    expect(screen.getByRole('heading', { name: 'Panel de Administración' })).toBeTruthy()
  })
})

describe('Página Admin (panel)', () => {
  beforeEach(() => {
    localStorage.clear()
    guardar('lug_current_user', { nombre: 'Jefe', email: 'jefe@duoc.cl', role: 'admin' })
  })

  it('el resumen muestra usuarios, órdenes, ventas y mensajes sin leer', () => {
    datosDePrueba()
    renderAdmin()
    const tarjeta = (titulo) => screen.getByText(titulo).parentElement.textContent

    expect(tarjeta('Usuarios registrados')).toContain('2')
    expect(tarjeta('Órdenes realizadas')).toContain('2')
    expect(tarjeta('Ventas totales')).toContain(`$${(45000).toLocaleString('es-CL')}`)
    expect(tarjeta('Mensajes sin leer')).toContain('1')
  })

  it('la pestaña Productos lista todo el catálogo con el precio en pesos', () => {
    renderAdmin()
    abrirPestana('Productos')
    const encabezados = screen.getAllByRole('columnheader').map((th) => th.textContent)
    expect(encabezados).toEqual(['ID', 'Nombre', 'Categoría', 'Precio'])
    // +1 por la fila de encabezados
    expect(screen.getAllByRole('row').length).toBe(productos.length + 1)

    const primero = productos[0]
    const fila = screen.getByRole('row', { name: new RegExp(primero.nombre) })
    expect(within(fila).getByText(`$${primero.precio.toLocaleString('es-CL')}`)).toBeTruthy()
  })

  it('en Órdenes se puede cambiar el estado de una orden', () => {
    datosDePrueba()
    renderAdmin()
    abrirPestana('Órdenes (2)')

    const fila = screen.getByRole('row', { name: /ORD-000001/ })
    fireEvent.click(within(fila).getByRole('button', { name: 'Cambiar estado' }))

    expect(within(fila).getByText('Completado')).toBeTruthy()
    expect(leer('lug_orders')[0].estado).toBe('Completado')

    // Un segundo clic la devuelve a Pendiente
    fireEvent.click(within(fila).getByRole('button', { name: 'Cambiar estado' }))
    expect(leer('lug_orders')[0].estado).toBe('Pendiente')
  })

  it('eliminar una orden pide confirmación y respeta la respuesta', () => {
    datosDePrueba()
    // Primero el usuario cancela (false) y después acepta (true).
    const confirmar = spyOn(window, 'confirm').and.returnValues(false, true)
    renderAdmin()
    abrirPestana('Órdenes (2)')
    const botonEliminar = () => within(screen.getByRole('row', { name: /ORD-000002/ })).getByRole('button', { name: 'Eliminar' })

    fireEvent.click(botonEliminar())
    expect(leer('lug_orders').length).toBe(2)

    fireEvent.click(botonEliminar())
    expect(confirmar).toHaveBeenCalledWith('¿Eliminar la orden ORD-000002?')
    expect(leer('lug_orders').map((o) => o.id)).toEqual(['ORD-000001'])
    expect(screen.getByRole('tab', { name: 'Órdenes (1)' })).toBeTruthy()
  })

  it('en Usuarios muestra puntos y nivel, y permite eliminar', () => {
    datosDePrueba()
    spyOn(window, 'confirm').and.returnValue(true)
    renderAdmin()
    abrirPestana('Usuarios (2)')

    const ana = screen.getByRole('row', { name: /ana@duoc.cl/ })
    expect(within(ana).getByText('Pro Gamer')).toBeTruthy()
    expect(within(screen.getByRole('row', { name: /pedro@duoc.cl/ })).getByText('Novato')).toBeTruthy()

    fireEvent.click(within(ana).getByRole('button', { name: 'Eliminar' }))
    expect(leer('lug_users').map((u) => u.email)).toEqual(['pedro@duoc.cl'])
  })

  it('en Mensajes se puede marcar como leído y eliminar', () => {
    datosDePrueba()
    spyOn(window, 'confirm').and.returnValue(true)
    renderAdmin()
    abrirPestana('Mensajes (1)')

    const carlos = screen.getByRole('row', { name: /carlos@mail.com/ })
    expect(within(carlos).getByText('Sin leer')).toBeTruthy()
    fireEvent.click(within(carlos).getByRole('button', { name: 'Marcar leído' }))

    expect(leer('lug_mensajes')[0].estado).toBe('Leído')
    expect(screen.getByRole('tab', { name: 'Mensajes (0)' })).toBeTruthy()

    fireEvent.click(within(carlos).getByRole('button', { name: 'Marcar sin leer' }))
    expect(leer('lug_mensajes')[0].estado).toBe('Sin leer')

    fireEvent.click(within(screen.getByRole('row', { name: /maria@mail.com/ })).getByRole('button', { name: 'Eliminar' }))
    expect(leer('lug_mensajes').length).toBe(1)
  })

  it('si se cancela la confirmación no se borra el usuario ni el mensaje', () => {
    guardar('lug_users', [{ email: 'sinnombre@duoc.cl' }])
    guardar('lug_mensajes', [{ nombre: 'Luis', email: 'luis@mail.com', mensaje: 'Hola' }])
    spyOn(window, 'confirm').and.returnValue(false)
    renderAdmin()

    abrirPestana('Usuarios (1)')
    const usuario = screen.getByRole('row', { name: /sinnombre@duoc.cl/ })
    expect(within(usuario).getByText('Sin nombre')).toBeTruthy()
    fireEvent.click(within(usuario).getByRole('button', { name: 'Eliminar' }))
    expect(leer('lug_users').length).toBe(1)

    abrirPestana('Mensajes (1)')
    const mensaje = screen.getByRole('row', { name: /luis@mail.com/ })
    expect(within(mensaje).getByText('Sin fecha')).toBeTruthy()
    fireEvent.click(within(mensaje).getByRole('button', { name: 'Eliminar' }))
    expect(leer('lug_mensajes').length).toBe(1)
  })

  it('sin datos cada pestaña muestra un aviso', () => {
    renderAdmin()
    abrirPestana('Órdenes (0)')
    expect(screen.getByText('No hay órdenes registradas.')).toBeTruthy()
    abrirPestana('Usuarios (0)')
    expect(screen.getByText('No hay usuarios registrados.')).toBeTruthy()
    abrirPestana('Mensajes (0)')
    expect(screen.getByText('No hay mensajes en la bandeja.')).toBeTruthy()
  })
})
