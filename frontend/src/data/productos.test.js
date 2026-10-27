import { describe, it, expect } from 'vitest'
import { productos } from './productos.js'

describe('Datos de productos', () => {
  it('59. es una lista con al menos 4 productos', () => {
    expect(Array.isArray(productos)).toBe(true)
    expect(productos.length).toBeGreaterThanOrEqual(4)
  })

  it('60. cada producto tiene los campos que usa la tarjeta', () => {
    productos.forEach((p) => {
      expect(p).toHaveProperty('id')
      expect(typeof p.nombre).toBe('string')
      expect(p.nombre.length).toBeGreaterThan(0)
      expect(typeof p.categoria).toBe('string')
      expect(typeof p.descripcion).toBe('string')
      expect(typeof p.imagen).toBe('string')
    })
  })

  it('61. los ids no se repiten', () => {
    const ids = productos.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('62. todos los precios son números positivos', () => {
    productos.forEach((p) => {
      expect(typeof p.precio).toBe('number')
      expect(p.precio).toBeGreaterThan(0)
    })
  })
})