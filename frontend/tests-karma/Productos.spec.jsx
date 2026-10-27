import { render, screen, fireEvent } from '@testing-library/react'
import Productos from '../src/pages/Productos.jsx'
import { CarritoProvider } from '../src/context/CarritoContext.jsx'
import { productos } from '../src/data/productos.js'

// Pruebas del catálogo: búsqueda y orden por precio (estado + useMemo).

const renderPagina = () =>
  render(
    <CarritoProvider>
      <Productos />
    </CarritoProvider>
  )

const nombresMostrados = () =>
  screen.getAllByRole('heading', { level: 4 }).map((titulo) => titulo.textContent)

const ordenarPorPrecio = (comparar) => [...productos].sort(comparar).map((p) => p.nombre)

describe('Página Productos', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra una tarjeta por cada producto del catálogo en su orden original', () => {
    renderPagina()
    expect(screen.getByRole('heading', { name: 'Nuestro Catálogo' })).toBeTruthy()
    expect(nombresMostrados()).toEqual(productos.map((p) => p.nombre))
  })

  it('el buscador filtra por nombre sin importar mayúsculas', () => {
    renderPagina()
    fireEvent.change(screen.getByPlaceholderText('Buscar por nombre de producto...'), {
      target: { value: 'level-up' },
    })
    expect(nombresMostrados()).toEqual([
      'Polera personalizada LEVEL-UP',
      'Poleron personalizado LEVEL-UP',
    ])
  })

  it('si la búsqueda no encuentra nada muestra un aviso', () => {
    renderPagina()
    fireEvent.change(screen.getByPlaceholderText('Buscar por nombre de producto...'), {
      target: { value: 'zzz' },
    })
    expect(screen.getByText('No se encontraron productos.')).toBeTruthy()
    expect(screen.queryAllByRole('heading', { level: 4 }).length).toBe(0)
  })

  it('ordena de menor a mayor precio', () => {
    renderPagina()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'price-asc' } })
    expect(nombresMostrados()).toEqual(ordenarPorPrecio((a, b) => a.precio - b.precio))
  })

  it('ordena de mayor a menor precio', () => {
    renderPagina()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'price-desc' } })
    expect(nombresMostrados()).toEqual(ordenarPorPrecio((a, b) => b.precio - a.precio))
  })
})
