import { Table, Button, Badge } from 'react-bootstrap'

const pesos = (n) => `$${Number(n).toLocaleString('es-CL')}`

// Recibe las órdenes por props y avisa al panel cuando se cambia o elimina una.
export default function TablaOrdenes({ ordenes, onCambiarEstado, onEliminar }) {
  if (ordenes.length === 0) return <p className="text-secondary">No hay órdenes registradas.</p>

  return (
    <Table striped bordered hover variant="dark" responsive>
      <thead>
        <tr>
          <th>ID Orden</th>
          <th>Cliente</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ordenes.map((orden) => (
          <tr key={orden.id}>
            <td>{orden.id}</td>
            <td>{orden.cliente}</td>
            <td>{pesos(orden.total)}</td>
            <td>
              <Badge bg={orden.estado === 'Completado' ? 'success' : 'warning'} text={orden.estado === 'Completado' ? undefined : 'dark'}>
                {orden.estado}
              </Badge>
            </td>
            <td className="d-flex gap-2">
              <Button size="sm" variant="outline-info" onClick={() => onCambiarEstado(orden.id)}>
                Cambiar estado
              </Button>
              <Button size="sm" variant="outline-danger" onClick={() => onEliminar(orden.id)}>
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
