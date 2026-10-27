import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import ProductCard from './ProductCard.jsx'
import { CarritoProvider } from '../context/CarritoContext.jsx'

const producto = {
  id: 7,
  nombre: 'Mouse Gamer',
  categoria: 'Pc',
  descripcion: 'Mouse con sensor de alta precisión.',
  precio: 29990,
  imagen: '/mouse.png',
  alt: 'Foto del mouse gamer',
}

const renderCard = (props = {}) =>
  render(
    <CarritoProvider>
      <ProductCard producto={producto} {...props} />
    </CarritoProvider>
  )

describe('ProductCard', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('11. muestra nombre, categoría y precio formateado', () => {
    renderCard()
    expect(screen.getByText('Mouse Gamer')).toBeInTheDocument()
    expect(screen.getByText('Pc')).toBeInTheDocument()
    expect(screen.getByText(/\$29\.990/)).toBeInTheDocument()
  })

  it('12. no muestra la descripción por defecto', () => {
    renderCard()
    expect(screen.queryByText(producto.descripcion)).not.toBeInTheDocument()
  })

  it('13. muestra la descripción si mostrarDescripcion es true', () => {
    renderCard({ mostrarDescripcion: true })
    expect(screen.getByText(producto.descripcion)).toBeInTheDocument()
  })

  it('14. la imagen usa la ruta y el texto alternativo del producto', () => {
    renderCard()
    const img = screen.getByAltText('Foto del mouse gamer')
    expect(img).toHaveAttribute('src', '/mouse.png')
  })

  it('15. al hacer clic agrega el producto al carrito y muestra ¡Añadido!', () => {
    renderCard()
    fireEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }))

    expect(screen.getByRole('button', { name: '¡Añadido!' })).toBeInTheDocument()
    const guardado = JSON.parse(localStorage.getItem('carrito'))
    expect(guardado).toEqual([{ ...producto, cantidad: 1 }])
  })

  it('16. el botón vuelve a "Añadir al carrito" después de 1.2 segundos', () => {
    vi.useFakeTimers()
    renderCard()
    fireEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }))
    expect(screen.getByRole('button', { name: '¡Añadido!' })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1300)
    })
    expect(screen.getByRole('button', { name: 'Añadir al carrito' })).toBeInTheDocument()
  })
})