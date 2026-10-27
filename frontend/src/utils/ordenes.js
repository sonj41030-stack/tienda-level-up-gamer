// Crea una orden de compra a partir del carrito y la guarda en localStorage.
export function guardarOrden({ carrito, sesion, subtotal, descuento }) {
  const ahora = new Date()
  const orden = {
    id: `ORD-${String(ahora.getTime()).slice(-6)}`,
    cliente: sesion?.nombre || sesion?.email || 'Invitado',
    email: sesion?.email ?? null,
    productos: carrito.map(({ id, nombre, precio, cantidad }) => ({ id, nombre, precio, cantidad })),
    subtotal,
    descuento,
    total: subtotal - descuento,
    fecha: ahora.toISOString(),
    estado: 'Pendiente',
  }
  const ordenes = JSON.parse(localStorage.getItem('lug_orders') || '[]')
  localStorage.setItem('lug_orders', JSON.stringify([...ordenes, orden]))
  return orden
}
