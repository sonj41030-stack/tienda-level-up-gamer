import { Table, Button } from 'react-bootstrap'

// Los mensajes nuevos de Contacto no traen estado: se consideran "Sin leer".
const estaLeido = (mensaje) => mensaje.estado === 'Leído'

const formatoFecha = (iso) => (iso ? new Date(iso).toLocaleDateString('es-CL') : 'Sin fecha')

export default function TablaMensajes({ mensajes, onCambiarEstado, onEliminar }) {
  if (mensajes.length === 0) return <p className="text-secondary">No hay mensajes en la bandeja.</p>

  return (
    <Table striped bordered hover variant="dark" responsive>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Mensaje</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {mensajes.map((mensaje, indice) => (
          <tr key={`${mensaje.fecha}-${indice}`}>
            <td className="text-nowrap">{formatoFecha(mensaje.fecha)}</td>
            <td>{mensaje.nombre}</td>
            <td>{mensaje.email}</td>
            <td>{mensaje.mensaje}</td>
            <td className={estaLeido(mensaje) ? 'text-secondary' : 'text-info fw-bold'}>
              {estaLeido(mensaje) ? 'Leído' : 'Sin leer'}
            </td>
            <td className="d-flex gap-2">
              <Button size="sm" variant="outline-info" onClick={() => onCambiarEstado(indice)}>
                {estaLeido(mensaje) ? 'Marcar sin leer' : 'Marcar leído'}
              </Button>
              <Button size="sm" variant="outline-danger" onClick={() => onEliminar(indice)}>
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
