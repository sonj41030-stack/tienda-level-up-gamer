import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Inicio from './Inicio.jsx'
import { CarritoProvider } from '../context/CarritoContext.jsx'

vi.mock('../data/productos.js', () => ({
  productos: Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    nombre: `Producto ${i + 1}`,
    categoria: 'Pc',
    descripcion: `Descripción ${i + 1}`,
    precio: 10000 * (i + 1),
    imagen: `/p${i + 1}.png`,
    alt: `producto ${i + 1}`,
  })),
}))

const renderInicio = () =>
  render(
    <MemoryRouter>
      <CarritoProvider>
        <Inicio />
      </CarritoProvider>
    </MemoryRouter>
  )

describe('Página Inicio', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('54. muestra el título y el texto de bienvenida', () => {
    renderInicio()
    expect(
      screen.getByRole('heading', { name: '¡Desafía tus límites con Level-Up Gamer!' })
    ).toBeInTheDocument()
    expect(screen.getByText(/Conviértete en el héroe de tu propia historia/)).toBeInTheDocument()
  })

  it('55. el botón Ver productos lleva a /productos', () => {
    renderInicio()
    expect(screen.getByRole('link', { name: 'Ver productos' })).toHaveAttribute('href', '/productos')
  })

  it('56. muestra la imagen del banner', () => {
    renderInicio()
    expect(screen.getByAltText('Banner Level-Up Gamer')).toHaveAttribute('src', '/images/tienda.jpg')
  })

  it('57. muestra solo los 4 primeros productos como destacados', () => {
    renderInicio()
    const nombres = screen.getAllByRole('heading', { level: 4 }).map((h) => h.textContent)
    expect(nombres).toEqual(['Producto 1', 'Producto 2', 'Producto 3', 'Producto 4'])
    expect(screen.queryByText('Producto 5')).not.toBeInTheDocument()
  })

  it('58. muestra el título de la sección y un botón de compra por producto', () => {
    renderInicio()
    expect(screen.getByRole('heading', { name: 'Productos Destacados' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Añadir al carrito' })).toHaveLength(4)
  })
})