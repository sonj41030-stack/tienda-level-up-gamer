import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CarritoProvider, useCarrito } from './CarritoContext.jsx'

const wrapper = ({ children }) => <CarritoProvider>{children}</CarritoProvider>

const polera = { id: 1, nombre: 'Polera', precio: 10000 }
const mouse = { id: 2, nombre: 'Mouse', precio: 5000 }

describe('CarritoContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('1. empieza con el carrito vacío', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper })
    expect(result.current.carrito).toEqual([])
    expect(result.current.totalItems).toBe(0)
    expect(result.current.totalPrecio).toBe(0)
  })

  it('2. carga el carrito guardado en localStorage', () => {
    localStorage.setItem('carrito', JSON.stringify([{ ...polera, cantidad: 2 }]))
    const { result } = renderHook(() => useCarrito(), { wrapper })
    expect(result.current.carrito).toHaveLength(1)
    expect(result.current.totalItems).toBe(2)
  })

  it('3. agrega un producto nuevo con cantidad 1', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper })
    act(() => result.current.agregar(polera))
    expect(result.current.carrito).toEqual([{ ...polera, cantidad: 1 }])
  })

  it('4. si el producto ya existe, aumenta su cantidad', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper })
    act(() => result.current.agregar(polera))
    act(() => result.current.agregar(mouse))
    act(() => result.current.agregar(polera))
    expect(result.current.carrito).toHaveLength(2)
    expect(result.current.carrito[0].cantidad).toBe(2)
    expect(result.current.carrito[1].cantidad).toBe(1)
  })

  it('5. elimina un producto por id', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper })
    act(() => result.current.agregar(polera))
    act(() => result.current.agregar(mouse))
    act(() => result.current.eliminar(1))
    expect(result.current.carrito).toEqual([{ ...mouse, cantidad: 1 }])
  })

  it('6. actualiza la cantidad de un producto', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper })
    act(() => result.current.agregar(polera))
    act(() => result.current.agregar(mouse))
    act(() => result.current.actualizarCantidad(1, 5))
    expect(result.current.carrito[0].cantidad).toBe(5)
    expect(result.current.carrito[1].cantidad).toBe(1)
  })

  it('7. si la cantidad es 0 o menor, elimina el producto', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper })
    act(() => result.current.agregar(polera))
    act(() => result.current.actualizarCantidad(1, 0))
    expect(result.current.carrito).toEqual([])
  })

  it('8. vacía todo el carrito', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper })
    act(() => result.current.agregar(polera))
    act(() => result.current.agregar(mouse))
    act(() => result.current.vaciarCarrito())
    expect(result.current.carrito).toEqual([])
  })

  it('9. calcula total de items y total en pesos', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper })
    act(() => result.current.agregar(polera))
    act(() => result.current.agregar(polera))
    act(() => result.current.agregar(mouse))
    expect(result.current.totalItems).toBe(3)
    expect(result.current.totalPrecio).toBe(25000)
  })

  it('10. guarda el carrito en localStorage al cambiar', () => {
    const { result } = renderHook(() => useCarrito(), { wrapper })
    act(() => result.current.agregar(polera))
    const guardado = JSON.parse(localStorage.getItem('carrito'))
    expect(guardado).toEqual([{ ...polera, cantidad: 1 }])
  })
})