import { render, screen, fireEvent, act } from '@testing-library/react'
import ProductCard from '../src/components/ProductCard.jsx'
import { CarritoProvider } from '../src/context/CarritoContext.jsx'

// Pruebas de un componente con PROPS (producto, mostrarDescripcion)
// y ESTADO propio (agregado: true/false).

const producto = {
  id: 7,
  nombre: 'Mouse Gamer',
  categoria: 'Pc',
  descripcion: 'Mouse con sensor de alta precisión.',
  precio: 29990,
  imagen: '/images/logitech-g502.jpg',
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

  it('muestra nombre, categoría y precio con formato chileno', () => {
    renderCard()
    expect(screen.getByRole('heading', { level: 4, name: 'Mouse Gamer' })).toBeTruthy()
    expect(screen.getByText('Pc')).toBeTruthy()
    expect(screen.getByText(`$${(29990).toLocaleString('es-CL')}`)).toBeTruthy()
  })

  it('por defecto oculta la descripción y con mostrarDescripcion la muestra', () => {
    const { unmount } = renderCard()
    expect(screen.queryByText(producto.descripcion)).toBeNull()
    unmount()

    renderCard({ mostrarDescripcion: true })
    expect(screen.getByText(producto.descripcion)).toBeTruthy()
  })

  it('la imagen usa la ruta y el texto alternativo que llegan por props', () => {
    renderCard()
    const imagen = screen.getByAltText('Foto del mouse gamer')
    expect(imagen.getAttribute('src')).toBe('/images/logitech-g502.jpg')
  })

  it('al hacer clic agrega el producto al carrito y cambia el botón a "¡Añadido!"', () => {
    renderCard()
    fireEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }))

    const boton = screen.getByRole('button', { name: '¡Añadido!' })
    expect(boton.className).toContain('btn-success')
    expect(JSON.parse(localStorage.getItem('carrito'))).toEqual([{ ...producto, cantidad: 1 }])
  })

  it('después de 1,2 segundos el botón vuelve a "Añadir al carrito" (reloj simulado)', () => {
    // jasmine.clock() reemplaza setTimeout para avanzar el tiempo sin esperar.
    jasmine.clock().install()
    try {
      renderCard()
      fireEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }))
      expect(screen.getByRole('button', { name: '¡Añadido!' })).toBeTruthy()

      act(() => {
        jasmine.clock().tick(1300)
      })
      expect(screen.getByRole('button', { name: 'Añadir al carrito' })).toBeTruthy()
      expect(screen.queryByRole('button', { name: '¡Añadido!' })).toBeNull()
    } finally {
      jasmine.clock().uninstall()
    }
  })
})
