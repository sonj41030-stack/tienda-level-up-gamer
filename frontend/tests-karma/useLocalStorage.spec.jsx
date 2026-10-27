import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../src/hooks/useLocalStorage.js'

// Pruebas del hook personalizado useLocalStorage.

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('si no hay nada guardado usa el valor inicial y lo guarda', () => {
    const { result } = renderHook(() => useLocalStorage('lista', ['a']))
    expect(result.current[0]).toEqual(['a'])
    expect(JSON.parse(localStorage.getItem('lista'))).toEqual(['a'])
  })

  it('recupera el valor que ya estaba guardado', () => {
    localStorage.setItem('lista', JSON.stringify(['guardado']))
    const { result } = renderHook(() => useLocalStorage('lista', []))
    expect(result.current[0]).toEqual(['guardado'])
  })

  it('al cambiar el valor también se actualiza localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('contador', 0))
    act(() => result.current[1](5))
    expect(result.current[0]).toBe(5)
    expect(localStorage.getItem('contador')).toBe('5')
  })
})
