import { obtenerNivel, siguienteNivel, generarCodigoReferido } from '../src/utils/niveles.js'

// Pruebas de LÓGICA pura del sistema de niveles (no dibujan nada en pantalla).

describe('Sistema de niveles', () => {
  it('asigna el nivel según los puntos, incluyendo los límites exactos', () => {
    expect(obtenerNivel(0).nombre).toBe('Novato')
    expect(obtenerNivel(999).nombre).toBe('Novato')
    expect(obtenerNivel(1000).nombre).toBe('Pro Gamer')
    expect(obtenerNivel(2999).nombre).toBe('Pro Gamer')
    expect(obtenerNivel(3000).nombre).toBe('Leyenda')
  })

  it('con puntos negativos (dato inválido) devuelve el nivel inicial', () => {
    expect(obtenerNivel(-50).nombre).toBe('Novato')
  })

  it('indica cuál es el siguiente nivel y null cuando ya está en el máximo', () => {
    expect(siguienteNivel(0).nombre).toBe('Pro Gamer')
    expect(siguienteNivel(1500).nombre).toBe('Leyenda')
    expect(siguienteNivel(5000)).toBeNull()
  })

  it('genera códigos de referido con el formato LUG-#### (mock de Math.random)', () => {
    spyOn(Math, 'random').and.returnValues(0, 0.999)
    expect(generarCodigoReferido()).toBe('LUG-1000')
    expect(generarCodigoReferido()).toBe('LUG-9991')
  })
})
