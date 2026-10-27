// Funciones para leer la sesión y los usuarios guardados en localStorage.

export const leerSesion = () => JSON.parse(localStorage.getItem('lug_current_user') || 'null')

export const leerUsuarios = () => JSON.parse(localStorage.getItem('lug_users') || '[]')

// Un usuario es administrador si tiene el rol "admin" o usa el correo admin@duoc.cl.
export const esAdmin = (usuario) =>
  Boolean(usuario && (usuario.role === 'admin' || usuario.email === 'admin@duoc.cl'))

// Puntos LevelUp del usuario con sesión iniciada (0 si no hay sesión o no tiene puntos).
export const puntosDeSesion = () => {
  const sesion = leerSesion()
  if (!sesion) return 0
  const usuario = leerUsuarios().find((u) => u.email === sesion.email)
  return usuario?.puntos ?? 0
}
