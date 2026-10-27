import { productos } from '../src/data/productos.js'

// Pruebas de los datos del catálogo que usan las tarjetas y el carrito.

describe('Datos de productos', () => {
  it('cada producto tiene los campos que necesita la tarjeta', () => {
    productos.forEach((p) => {
      expect(p.id).toEqual(jasmine.any(Number))
      expect(p.nombre.length).toBeGreaterThan(0)
      expect(p.categoria).toEqual(jasmine.any(String))
      expect(p.descripcion).toEqual(jasmine.any(String))
      expect(p.imagen).toMatch(/^\/images\/.+\.jpg$/)
    })
  })

  it('los ids no se repiten', () => {
    const ids = productos.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('todos los precios son números enteros positivos', () => {
    productos.forEach((p) => {
      expect(Number.isInteger(p.precio)).toBeTrue()
      expect(p.precio).toBeGreaterThan(0)
    })
  })
})
