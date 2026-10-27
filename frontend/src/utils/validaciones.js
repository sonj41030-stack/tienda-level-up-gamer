// Validaciones de formularios. Son funciones puras: fáciles de probar por separado.

export const esCorreoValido = (email) => /^\S+@\S+\.\S+$/.test(email)

// Quita puntos, guion y espacios: "12.345.678-5" -> "123456785"
export const limpiarRun = (run) => run.replace(/[.\-\s]/g, '').toUpperCase()

// Valida un RUN chileno calculando su dígito verificador (algoritmo módulo 11).
export function esRunValido(run) {
  const limpio = limpiarRun(run)
  if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false

  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1)

  let suma = 0
  let multiplicador = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }

  const resto = 11 - (suma % 11)
  const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto)
  return dv === esperado
}

// La fecha de nacimiento no puede ser posterior a hoy.
export const esFechaPasada = (fecha, hoy = new Date()) => Boolean(fecha) && new Date(fecha) <= hoy
