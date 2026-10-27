import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Carrito from './Carrito.jsx'
import { CarritoProvider } from '../context/CarritoContext.jsx'

const polera = { id: 1, nombre: 'Polera', precio: 10000, imagen: '/p.png', cantidad: 2 }
const mouse = { id: 2, nombre: 'Mouse', precio: 5000, imagen: '/m.png', cantidad: 3 }

const guardarCarrito = (items) => localStorage.setItem('carrito', JSON.stringify(items))
const leerCarrito = () => JSON.parse(localStorage.getItem('carrito'))
const peso = (n) => `$${n.toLocaleString('es-CL')}`

const renderCarrito = () =>
  render(
    <MemoryRouter>
      <CarritoProvider>
        <Carrito />
      </CarritoProvider>
    </MemoryRouter>
  )

describe('Página Carrito', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('63. con el carrito vacío muestra el aviso y el link a productos', () => {
    renderCarrito()
    expect(screen.getByRole('heading', { name: 'Tu Carrito de Compras' })).toBeInTheDocument()
    expect(screen.getByText('El carrito está vacío.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver Productos' })).toHaveAttribute('href', '/productos')
    expect(screen.queryByText('Finalizar Compra')).not.toBeInTheDocument()
  })

  it('64. con productos muestra nombre, precio y cantidad de cada uno', () => {
    guardarCarrito([polera, mouse])
    renderCarrito()
    expect(screen.getByRole('heading', { level: 4, name: 'Polera' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 4, name: 'Mouse' })).toBeInTheDocument()
    expect(screen.getByText(peso(10000))).toBeInTheDocument()
    expect(screen.getByText(peso(5000))).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('65. calcula el subtotal de cada producto y el total', () => {
    guardarCarrito([polera, mouse])
    renderCarrito()
    expect(screen.getByText(peso(20000))).toBeInTheDocument()
    expect(screen.getByText(peso(15000))).toBeInTheDocument()
    expect(screen.getByText(`Total: ${peso(35000)}`)).toBeInTheDocument()
  })

  it('66. el botón + aumenta la cantidad', async () => {
    guardarCarrito([polera, mouse])
    const user = userEvent.setup()
    renderCarrito()
    await user.click(screen.getAllByRole('button', { name: '+' })[0])
    expect(leerCarrito()[0].cantidad).toBe(3)
    expect(screen.getByText(`Total: ${peso(45000)}`)).toBeInTheDocument()
  })

  it('67. el botón - disminuye la cantidad', async () => {
    guardarCarrito([polera, mouse])
    const user = userEvent.setup()
    renderCarrito()
    await user.click(screen.getAllByRole('button', { name: '-' })[0])
    expect(leerCarrito()[0].cantidad).toBe(1)
    expect(screen.getByText(`Total: ${peso(25000)}`)).toBeInTheDocument()
  })

  it('68. el botón - con cantidad 1 elimina el producto', async () => {
    guardarCarrito([{ ...polera, cantidad: 1 }])
    const user = userEvent.setup()
    renderCarrito()
    await user.click(screen.getByRole('button', { name: '-' }))
    expect(screen.getByText('El carrito está vacío.')).toBeInTheDocument()
    expect(leerCarrito()).toEqual([])
  })

  it('69. Eliminar quita solo ese producto', async () => {
    guardarCarrito([polera, mouse])
    const user = userEvent.setup()
    renderCarrito()
    await user.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])
    expect(screen.queryByRole('heading', { level: 4, name: 'Polera' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 4, name: 'Mouse' })).toBeInTheDocument()
  })

  it('70. Vaciar Carrito deja el carrito vacío', async () => {
    guardarCarrito([polera, mouse])
    const user = userEvent.setup()
    renderCarrito()
    await user.click(screen.getByRole('button', { name: 'Vaciar Carrito' }))
    expect(screen.getByText('El carrito está vacío.')).toBeInTheDocument()
    expect(leerCarrito()).toEqual([])
  })

  it('71. muestra el botón Finalizar Compra cuando hay productos', () => {
    guardarCarrito([polera])
    renderCarrito()
    expect(screen.getByRole('button', { name: 'Finalizar Compra' })).toBeInTheDocument()
  })
})