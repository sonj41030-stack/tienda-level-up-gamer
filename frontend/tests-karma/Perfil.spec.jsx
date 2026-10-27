import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Perfil from '../src/pages/Perfil.jsx'

// Pruebas del perfil: protección por sesión, nivel según puntos y canje de puntos.

const renderPerfil = () =>
  render(
    <MemoryRouter initialEntries={['/perfil']}>
      <Routes>
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/login" element={<h1>Página de login</h1>} />
      </Routes>
    </MemoryRouter>
  )

const conUsuario = (datos) => {
  const usuario = { nombre: 'Ana Pérez', email: 'ana@duoc.cl', password: '123456', role: 'cliente', ...datos }
  localStorage.setItem('lug_users', JSON.stringify([usuario]))
  localStorage.setItem('lug_current_user', JSON.stringify({ nombre: usuario.nombre, email: usuario.email, role: 'cliente' }))
}

const puntosGuardados = () => JSON.parse(localStorage.getItem('lug_users'))[0].puntos

describe('Página Perfil', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('sin sesión iniciada redirige al login', () => {
    renderPerfil()
    expect(screen.getByText('Página de login')).toBeTruthy()
  })

  it('muestra nombre, correo, nivel, puntos y código de referido del usuario', () => {
    conUsuario({ puntos: 200, codigoReferido: 'LUG-4821' })
    renderPerfil()
    expect(screen.getByRole('heading', { name: 'Ana Pérez' })).toBeTruthy()
    expect(screen.getByText('ana@duoc.cl')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Novato' })).toBeTruthy()
    expect(screen.getByText('200 Pts')).toBeTruthy()
    expect(screen.getByText('LUG-4821')).toBeTruthy()
    expect(screen.getByText('Te faltan 800 puntos para llegar a Pro Gamer.')).toBeTruthy()
  })

  it('un usuario antiguo sin puntos ni código parte en 0 y sin código', () => {
    conUsuario({})
    renderPerfil()
    expect(screen.getByText('0 Pts')).toBeTruthy()
    expect(screen.getByText('—')).toBeTruthy()
  })

  it('con 1.200 puntos es Pro Gamer y muestra su descuento', () => {
    conUsuario({ puntos: 1200 })
    renderPerfil()
    expect(screen.getByRole('heading', { name: 'Pro Gamer' })).toBeTruthy()
    expect(screen.getByText('5% de descuento')).toBeTruthy()
  })

  it('en el nivel Leyenda indica que llegó al máximo', () => {
    conUsuario({ puntos: 3500 })
    renderPerfil()
    expect(screen.getByRole('heading', { name: 'Leyenda' })).toBeTruthy()
    expect(screen.getByText('¡Llegaste al nivel máximo!')).toBeTruthy()
  })

  it('sin puntos suficientes no deja canjear y muestra un aviso', () => {
    conUsuario({ puntos: 300 })
    renderPerfil()
    fireEvent.click(screen.getByRole('button', { name: 'Canjear 500 Puntos' }))

    expect(screen.getByRole('alert').textContent).toContain('Puntos insuficientes')
    expect(puntosGuardados()).toBe(300)
  })

  it('al canjear descuenta 500 puntos, lo guarda y actualiza el nivel en pantalla', () => {
    conUsuario({ puntos: 1200 })
    renderPerfil()
    fireEvent.click(screen.getByRole('button', { name: 'Canjear 500 Puntos' }))

    expect(screen.getByRole('alert').textContent).toContain('Canjeaste 500 puntos por un cupón de $5.000')
    expect(screen.getByText('700 Pts')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Novato' })).toBeTruthy()
    expect(puntosGuardados()).toBe(700)
  })

  it('al canjear solo cambian los puntos del usuario conectado', () => {
    localStorage.setItem(
      'lug_users',
      JSON.stringify([
        { nombre: 'Otro Gamer', email: 'otro@duoc.cl', puntos: 900 },
        { nombre: 'Ana Pérez', email: 'ana@duoc.cl', puntos: 600 },
      ])
    )
    localStorage.setItem('lug_current_user', JSON.stringify({ nombre: 'Ana Pérez', email: 'ana@duoc.cl' }))
    renderPerfil()
    fireEvent.click(screen.getByRole('button', { name: 'Canjear 500 Puntos' }))

    const [otro, ana] = JSON.parse(localStorage.getItem('lug_users'))
    expect(otro.puntos).toBe(900)
    expect(ana.puntos).toBe(100)
  })

  it('si la sesión no está en la lista de usuarios, usa el correo como nombre', () => {
    localStorage.setItem('lug_current_user', JSON.stringify({ email: 'admin@duoc.cl', role: 'admin' }))
    renderPerfil()
    expect(screen.getByRole('heading', { name: 'admin@duoc.cl' })).toBeTruthy()
    expect(screen.getByText('0 Pts')).toBeTruthy()
  })
})
