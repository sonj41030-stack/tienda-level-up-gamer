import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Admin from './Admin.jsx'

vi.mock('../data/productos', () => ({
  productos: [
    { id: 1, nombre: 'Silla Gamer', categoria: 'Sillas', precio: 300000 },
    { id: 2, nombre: 'Mouse Razer', categoria: 'Pc', precio: 30000 },
  ],
}))

const renderAdmin = () =>
  render(
    <MemoryRouter>
      <Admin />
    </MemoryRouter>
  )

const abrirProductos = async () => {
  const user = userEvent.setup()
  renderAdmin()
  await user.click(screen.getByRole('tab', { name: 'Productos' }))
}

describe('Página Admin', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('lug_current_user', JSON.stringify({ nombre: 'Jefe', email: 'jefe@duoc.cl', role: 'admin' }))
  })

  it('72. muestra el título y la descripción del panel', () => {
    renderAdmin()
    expect(screen.getByRole('heading', { name: 'Panel de Administración' })).toBeInTheDocument()
    expect(screen.getByText('Gestión de inventario, órdenes, usuarios y mensajes.')).toBeInTheDocument()
  })

  it('73. la tabla de productos tiene los cuatro encabezados', async () => {
    await abrirProductos()
    const encabezados = screen.getAllByRole('columnheader').map((th) => th.textContent)
    expect(encabezados).toEqual(['ID', 'Nombre', 'Categoría', 'Precio'])
  })

  it('74. muestra una fila por cada producto', async () => {
    await abrirProductos()
    expect(screen.getAllByRole('row')).toHaveLength(3)
    const fila = screen.getByRole('row', { name: /Silla Gamer/ })
    expect(within(fila).getByText('1')).toBeInTheDocument()
    expect(within(fila).getByText('Sillas')).toBeInTheDocument()
  })

  it('75. formatea el precio en pesos chilenos', async () => {
    await abrirProductos()
    expect(screen.getByText(`$${(300000).toLocaleString('es-CL')}`)).toBeInTheDocument()
    expect(screen.getByText(`$${(30000).toLocaleString('es-CL')}`)).toBeInTheDocument()
  })

  it('77. un cliente no puede ver el panel', () => {
    localStorage.setItem('lug_current_user', JSON.stringify({ nombre: 'Ana', email: 'ana@duoc.cl', role: 'cliente' }))
    renderAdmin()
    expect(screen.getByText('No tienes permisos para ver el panel de administración.')).toBeInTheDocument()
  })
})
