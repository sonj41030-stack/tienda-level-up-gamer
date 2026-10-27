import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Productos from './Productos.jsx'
import { CarritoProvider } from '../context/CarritoContext.jsx'

vi.mock('../data/productos.js', () => ({
  productos: [
    { id: 1, nombre: 'Silla Gamer', categoria: 'Sillas', descripcion: 'Silla cómoda', precio: 300000, imagen: '/a.png', alt: 'silla' },
    { id: 2, nombre: 'Mouse Razer', categoria: 'Pc', descripcion: 'Mouse RGB', precio: 30000, imagen: '/b.png', alt: 'mouse razer' },
    { id: 3, nombre: 'Mouse Logitech', categoria: 'Pc', descripcion: 'Mouse preciso', precio: 50000, imagen: '/c.png', alt: 'mouse logitech' },
  ],
}))

const renderPagina = () =>
  render(
    <CarritoProvider>
      <Productos />
    </CarritoProvider>
  )

const nombresMostrados = () =>
  screen.getAllByRole('heading', { level: 4 }).map((h) => h.textContent)

describe('Página Productos', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('17. muestra el título y una tarjeta por cada producto', () => {
    renderPagina()
    expect(screen.getByText('Nuestro Catálogo')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Añadir al carrito' })).toHaveLength(3)
  })

  it('18. filtra por nombre sin importar mayúsculas', async () => {
    const user = userEvent.setup()
    renderPagina()
    await user.type(screen.getByPlaceholderText('Buscar por nombre de producto...'), 'MOUSE')
    expect(nombresMostrados()).toEqual(['Mouse Razer', 'Mouse Logitech'])
    expect(screen.queryByText('Silla Gamer')).not.toBeInTheDocument()
  })

  it('19. muestra un mensaje si no hay resultados', async () => {
    const user = userEvent.setup()
    renderPagina()
    await user.type(screen.getByPlaceholderText('Buscar por nombre de producto...'), 'zzz')
    expect(screen.getByText('No se encontraron productos.')).toBeInTheDocument()
  })

  it('20. mantiene el orden original por defecto', () => {
    renderPagina()
    expect(nombresMostrados()).toEqual(['Silla Gamer', 'Mouse Razer', 'Mouse Logitech'])
  })

  it('21. ordena de menor a mayor precio', async () => {
    const user = userEvent.setup()
    renderPagina()
    await user.selectOptions(screen.getByRole('combobox'), 'price-asc')
    expect(nombresMostrados()).toEqual(['Mouse Razer', 'Mouse Logitech', 'Silla Gamer'])
  })

  it('22. ordena de mayor a menor precio', async () => {
    const user = userEvent.setup()
    renderPagina()
    await user.selectOptions(screen.getByRole('combobox'), 'price-desc')
    expect(nombresMostrados()).toEqual(['Silla Gamer', 'Mouse Logitech', 'Mouse Razer'])
  })
})