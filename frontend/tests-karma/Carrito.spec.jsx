import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Carrito from '../src/pages/Carrito.jsx'
import { CarritoProvider } from '../src/context/CarritoContext.jsx'

// Pruebas de la página del carrito: lo que se ve (DOM) y lo que hacen los botones.

const polera = { id: 1, nombre: 'Polera', precio: 10000, imagen: '/images/polera-levelup.jpg', cantidad: 2 }
const mouse = { id: 2, nombre: 'Mouse', precio: 5000, imagen: '/images/logitech-g502.jpg', cantidad: 3 }

const guardarCarrito = (items) => localStorage.setItem('carrito', JSON.stringify(items))
const leerCarrito = () => JSON.parse(localStorage.getItem('carrito'))
const pesos = (n) => `$${n.toLocaleString('es-CL')}`

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

  it('con el carrito vacío muestra el aviso y el enlace a productos', () => {
    renderCarrito()
    expect(screen.getByText('El carrito está vacío.')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Ver Productos' }).getAttribute('href')).toBe('/productos')
    expect(screen.queryByRole('button', { name: 'Finalizar Compra' })).toBeNull()
  })

  it('muestra cada producto con su subtotal y el total general', () => {
    guardarCarrito([polera, mouse])
    renderCarrito()
    expect(screen.getByRole('heading', { level: 4, name: 'Polera' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 4, name: 'Mouse' })).toBeTruthy()
    expect(screen.getByText(pesos(20000))).toBeTruthy()
    expect(screen.getByText(pesos(15000))).toBeTruthy()
    expect(screen.getByText(`Total: ${pesos(35000)}`)).toBeTruthy()
  })

  it('el botón + suma una unidad y actualiza el total', () => {
    guardarCarrito([polera, mouse])
    renderCarrito()
    fireEvent.click(screen.getAllByRole('button', { name: '+' })[0])
    expect(leerCarrito()[0].cantidad).toBe(3)
    expect(screen.getByText(`Total: ${pesos(45000)}`)).toBeTruthy()
  })

  it('el botón - resta una unidad y actualiza el total', () => {
    guardarCarrito([polera, mouse])
    renderCarrito()
    fireEvent.click(screen.getAllByRole('button', { name: '-' })[1])
    expect(leerCarrito()[1].cantidad).toBe(2)
    expect(screen.getByText(`Total: ${pesos(30000)}`)).toBeTruthy()
  })

  it('el botón - con cantidad 1 quita el producto del carrito', () => {
    guardarCarrito([{ ...polera, cantidad: 1 }])
    renderCarrito()
    fireEvent.click(screen.getByRole('button', { name: '-' }))
    expect(screen.getByText('El carrito está vacío.')).toBeTruthy()
    expect(leerCarrito()).toEqual([])
  })

  it('Eliminar quita solo ese producto', () => {
    guardarCarrito([polera, mouse])
    renderCarrito()
    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])
    expect(screen.queryByRole('heading', { level: 4, name: 'Polera' })).toBeNull()
    expect(screen.getByRole('heading', { level: 4, name: 'Mouse' })).toBeTruthy()
  })

  it('Vaciar Carrito elimina todos los productos', () => {
    guardarCarrito([polera, mouse])
    renderCarrito()
    fireEvent.click(screen.getByRole('button', { name: 'Vaciar Carrito' }))
    expect(screen.getByText('El carrito está vacío.')).toBeTruthy()
    expect(leerCarrito()).toEqual([])
  })
})

describe('Finalizar Compra', () => {
  const leerOrdenes = () => JSON.parse(localStorage.getItem('lug_orders') || '[]')
  const fecha = new Date('2026-10-23T15:30:00Z')
  const idEsperado = `ORD-${String(fecha.getTime()).slice(-6)}`

  beforeEach(() => {
    localStorage.clear()
    // jasmine.clock().mockDate fija la fecha actual para que el número de orden sea predecible.
    jasmine.clock().install()
    jasmine.clock().mockDate(fecha)
  })

  afterEach(() => {
    jasmine.clock().uninstall()
  })

  it('como invitado guarda la orden, vacía el carrito y muestra la confirmación', () => {
    guardarCarrito([polera, mouse])
    renderCarrito()
    fireEvent.click(screen.getByRole('button', { name: 'Finalizar Compra' }))

    expect(leerOrdenes()).toEqual([
      {
        id: idEsperado,
        cliente: 'Invitado',
        email: null,
        productos: [
          { id: 1, nombre: 'Polera', precio: 10000, cantidad: 2 },
          { id: 2, nombre: 'Mouse', precio: 5000, cantidad: 3 },
        ],
        subtotal: 35000,
        descuento: 0,
        total: 35000,
        fecha: fecha.toISOString(),
        estado: 'Pendiente',
      },
    ])
    expect(leerCarrito()).toEqual([])
    expect(screen.getByRole('heading', { name: '¡Compra realizada!' })).toBeTruthy()
    expect(screen.getByText(idEsperado)).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Seguir comprando' }).getAttribute('href')).toBe('/productos')
  })

  it('un usuario Pro Gamer ve y recibe su 5% de descuento', () => {
    localStorage.setItem('lug_users', JSON.stringify([{ nombre: 'Ana Pérez', email: 'ana@duoc.cl', puntos: 1200 }]))
    localStorage.setItem('lug_current_user', JSON.stringify({ nombre: 'Ana Pérez', email: 'ana@duoc.cl' }))
    guardarCarrito([polera, mouse])
    renderCarrito()

    expect(screen.getByText('Descuento Pro Gamer (5%)')).toBeTruthy()
    expect(screen.getByText(`-${pesos(1750)}`)).toBeTruthy()
    expect(screen.getByText(`Total: ${pesos(33250)}`)).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Finalizar Compra' }))
    const [orden] = leerOrdenes()
    expect(orden.cliente).toBe('Ana Pérez')
    expect(orden.email).toBe('ana@duoc.cl')
    expect(orden.descuento).toBe(1750)
    expect(orden.total).toBe(33250)
  })

  it('un usuario Novato no tiene descuento', () => {
    localStorage.setItem('lug_current_user', JSON.stringify({ email: 'pedro@duoc.cl' }))
    guardarCarrito([polera])
    renderCarrito()

    expect(screen.queryByText(/Descuento/)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Finalizar Compra' }))
    expect(leerOrdenes()[0].cliente).toBe('pedro@duoc.cl')
  })

  it('las órdenes nuevas se agregan a las que ya existían', () => {
    localStorage.setItem('lug_orders', JSON.stringify([{ id: 'ORD-000001', total: 1000 }]))
    guardarCarrito([polera])
    renderCarrito()
    fireEvent.click(screen.getByRole('button', { name: 'Finalizar Compra' }))

    expect(leerOrdenes().map((o) => o.id)).toEqual(['ORD-000001', idEsperado])
  })
})
