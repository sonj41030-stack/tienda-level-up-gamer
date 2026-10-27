import { Table, Button } from 'react-bootstrap'
import { obtenerNivel } from '../../utils/niveles.js'

export default function TablaUsuarios({ usuarios, onEliminar }) {
  if (usuarios.length === 0) return <p className="text-secondary">No hay usuarios registrados.</p>

  return (
    <Table striped bordered hover variant="dark" responsive>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Puntos</th>
          <th>Nivel</th>
          <th>Código</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario) => (
          <tr key={usuario.email}>
            <td>{usuario.nombre || 'Sin nombre'}</td>
            <td>{usuario.email}</td>
            <td>{usuario.puntos ?? 0}</td>
            <td>{obtenerNivel(usuario.puntos ?? 0).nombre}</td>
            <td>{usuario.codigoReferido || '—'}</td>
            <td>
              <Button size="sm" variant="outline-danger" onClick={() => onEliminar(usuario.email)}>
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
