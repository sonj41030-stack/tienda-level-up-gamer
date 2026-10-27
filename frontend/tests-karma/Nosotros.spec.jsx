import { render, screen } from '@testing-library/react'
import Nosotros from '../src/pages/Nosotros.jsx'

describe('Página Nosotros', () => {
  it('muestra la historia de la tienda', () => {
    render(<Nosotros />)
    expect(screen.getByRole('heading', { level: 2, name: 'Nuestra Historia' })).toBeTruthy()
    expect(screen.getByText(/Nacimos en 2020/)).toBeTruthy()
  })

  it('muestra misión, visión y valores', () => {
    render(<Nosotros />)
    const titulos = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(titulos).toEqual(jasmine.arrayContaining(['Nuestra Misión', 'Nuestra Visión', 'Nuestros Valores']))
  })

  it('muestra a cada integrante del equipo con su cargo e iniciales', () => {
    render(<Nosotros />)
    const integrantes = screen.getAllByRole('heading', { level: 4 }).map((h) => h.textContent)
    expect(integrantes).toEqual(['Andre Ruz', 'Ariel Velasquez', 'Edixon Cabriles'])
    expect(screen.getByText('Fundador & CEO')).toBeTruthy()
    expect(screen.getByText('AR')).toBeTruthy()
  })
})
