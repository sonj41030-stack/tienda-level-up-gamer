// Sistema de niveles y puntos LevelUp (migrado de js/levelUpSystem.js).
// Son funciones "puras": reciben datos y devuelven un resultado, sin tocar la página.

export const PUNTOS_POR_REFERIR = 500
export const PUNTOS_POR_SER_REFERIDO = 200
export const PUNTOS_POR_CANJE = 500
export const VALOR_CUPON = 5000

export const NIVELES = [
  { nombre: 'Novato', minimo: 0, descuento: 0 },
  { nombre: 'Pro Gamer', minimo: 1000, descuento: 5 },
  { nombre: 'Leyenda', minimo: 3000, descuento: 10 },
]

// Devuelve el nivel más alto cuyo mínimo de puntos ya se alcanzó.
export function obtenerNivel(puntos) {
  return NIVELES.filter((nivel) => puntos >= nivel.minimo).pop() ?? NIVELES[0]
}

// Devuelve el próximo nivel por alcanzar, o null si ya está en el máximo.
export function siguienteNivel(puntos) {
  return NIVELES.find((nivel) => nivel.minimo > puntos) ?? null
}

// Genera un código como "LUG-4821".
export function generarCodigoReferido() {
  return `LUG-${Math.floor(1000 + Math.random() * 9000)}`
}
