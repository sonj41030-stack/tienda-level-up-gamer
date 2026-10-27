import { renderHook, act } from '@testing-library/react'
import { CarritoProvider, useCarrito } from '../src/context/CarritoContext.jsx'

// Pruebas de la LÓGICA del carrito (estado global con Context + useState).
// renderHook permite usar el hook useCarrito sin dibujar ninguna página.

const wrapper = ({ children }) => <CarritoProvider>{children}</CarritoProvider>
const usarCarrito = () => renderHook(() => useCarrito(), { wrapper }).result

const polera = { id: 1, nombre: 'Polera', precio: 10000 }
const mouse = { id: 2, nombre: 'Mouse', precio: 5000 }

describe('CarritoContext (lógica del carrito)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('parte vacío y con los totales en cero', () => {
    const carrito = usarCarrito()
    expect(carrito.current.carrito).toEqual([])
    expect(carrito.current.totalItems).toBe(0)
    expect(carrito.current.totalPrecio).toBe(0)
  })

  it('recupera el carrito guardado en localStorage', () => {
    localStorage.setItem('carrito', JSON.stringify([{ ...polera, cantidad: 2 }]))
    const carrito = usarCarrito()
    expect(carrito.current.carrito.length).toBe(1)
    expect(carrito.current.totalItems).toBe(2)
  })

  it('agregar un producto nuevo lo deja con cantidad 1', () => {
    const carrito = usarCarrito()
    act(() => carrito.current.agregar(polera))
    expect(carrito.current.carrito).toEqual([{ ...polera, cantidad: 1 }])
  })

  it('agregar un producto repetido aumenta su cantidad en vez de duplicarlo', () => {
    const carrito = usarCarrito()
    act(() => carrito.current.agregar(polera))
    act(() => carrito.current.agregar(mouse))
    act(() => carrito.current.agregar(polera))
    expect(carrito.current.carrito.length).toBe(2)
    expect(carrito.current.carrito[0].cantidad).toBe(2)
    expect(carrito.current.carrito[1].cantidad).toBe(1)
  })

  it('eliminar quita solo el producto indicado', () => {
    const carrito = usarCarrito()
    act(() => carrito.current.agregar(polera))
    act(() => carrito.current.agregar(mouse))
    act(() => carrito.current.eliminar(polera.id))
    expect(carrito.current.carrito).toEqual([{ ...mouse, cantidad: 1 }])
  })

  it('actualizarCantidad cambia la cantidad de un producto', () => {
    const carrito = usarCarrito()
    act(() => carrito.current.agregar(polera))
    act(() => carrito.current.actualizarCantidad(polera.id, 5))
    expect(carrito.current.carrito[0].cantidad).toBe(5)
  })

  it('actualizarCantidad con 0 o menos elimina el producto', () => {
    const carrito = usarCarrito()
    act(() => carrito.current.agregar(polera))
    act(() => carrito.current.actualizarCantidad(polera.id, 0))
    expect(carrito.current.carrito).toEqual([])
  })

  it('vaciarCarrito deja la lista vacía', () => {
    const carrito = usarCarrito()
    act(() => carrito.current.agregar(polera))
    act(() => carrito.current.agregar(mouse))
    act(() => carrito.current.vaciarCarrito())
    expect(carrito.current.carrito).toEqual([])
    expect(carrito.current.totalItems).toBe(0)
  })

  it('calcula el total de unidades y el total a pagar', () => {
    const carrito = usarCarrito()
    act(() => carrito.current.agregar(polera))
    act(() => carrito.current.agregar(polera))
    act(() => carrito.current.agregar(mouse))
    expect(carrito.current.totalItems).toBe(3)
    expect(carrito.current.totalPrecio).toBe(25000)
  })

  it('guarda cada cambio en localStorage (espía sobre setItem)', () => {
    // spyOn reemplaza localStorage.setItem por un espía; callThrough deja
    // que igual se ejecute el método real.
    const espia = spyOn(Storage.prototype, 'setItem').and.callThrough()
    const carrito = usarCarrito()
    act(() => carrito.current.agregar(polera))

    expect(espia).toHaveBeenCalledWith('carrito', JSON.stringify([{ ...polera, cantidad: 1 }]))
    expect(JSON.parse(localStorage.getItem('carrito'))).toEqual([{ ...polera, cantidad: 1 }])
  })
})
