import { esRunValido, limpiarRun, esCorreoValido, esFechaPasada } from '../src/utils/validaciones.js'

// Pruebas de LÓGICA pura de las validaciones del formulario de registro.

describe('Validaciones', () => {
  describe('RUN chileno', () => {
    it('acepta RUN con dígito verificador correcto, con o sin puntos y guion', () => {
      expect(esRunValido('12345678-5')).toBeTrue()
      expect(esRunValido('12.345.678-5')).toBeTrue()
      expect(esRunValido('123456785')).toBeTrue()
      expect(esRunValido('7654321-6')).toBeTrue()
    })

    it('acepta dígitos verificadores K (mayúscula o minúscula) y 0', () => {
      expect(esRunValido('10000013-K')).toBeTrue()
      expect(esRunValido('10000013-k')).toBeTrue()
      expect(esRunValido('10000004-0')).toBeTrue()
    })

    it('rechaza un dígito verificador incorrecto', () => {
      expect(esRunValido('12345678-9')).toBeFalse()
      expect(esRunValido('19011022-K')).toBeFalse()
    })

    it('rechaza textos con formato inválido', () => {
      expect(esRunValido('')).toBeFalse()
      expect(esRunValido('abc')).toBeFalse()
      expect(esRunValido('123-4')).toBeFalse()
    })

    it('limpiarRun quita puntos y guion y pasa la K a mayúscula', () => {
      expect(limpiarRun('10.000.013-k')).toBe('10000013K')
    })
  })

  it('valida el formato del correo', () => {
    expect(esCorreoValido('ana@duoc.cl')).toBeTrue()
    expect(esCorreoValido('ana@duoc')).toBeFalse()
    expect(esCorreoValido('ana duoc.cl')).toBeFalse()
  })

  it('la fecha de nacimiento debe existir y no ser futura', () => {
    const hoy = new Date('2026-10-23T12:00:00')
    expect(esFechaPasada('2000-05-10', hoy)).toBeTrue()
    expect(esFechaPasada('2030-01-01', hoy)).toBeFalse()
    expect(esFechaPasada('', hoy)).toBeFalse()
  })
})
