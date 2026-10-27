import { Navigate } from 'react-router-dom'
import { Container, Row, Col, Card, Tabs, Tab, Table, Alert } from 'react-bootstrap'
import { productos } from '../data/productos'
import { leerSesion, esAdmin } from '../utils/sesion.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import TablaOrdenes from '../components/admin/TablaOrdenes.jsx'
import TablaUsuarios from '../components/admin/TablaUsuarios.jsx'
import TablaMensajes from '../components/admin/TablaMensajes.jsx'

const pesos = (n) => `$${n.toLocaleString('es-CL')}`

function Estadistica({ titulo, valor }) {
  return (
    <Card bg="dark" text="light" className="h-100 text-center p-3 border-secondary">
      <small className="text-secondary">{titulo}</small>
      <p className="fs-3 text-info mb-0">{valor}</p>
    </Card>
  )
}

// El panel solo se muestra a administradores; la protección está en este componente.
export default function Admin() {
  const sesion = leerSesion()

  if (!sesion) return <Navigate to="/login" replace />
  if (!esAdmin(sesion)) {
    return (
      <Container className="my-5">
        <Alert variant="danger">No tienes permisos para ver el panel de administración.</Alert>
      </Container>
    )
  }

  return <PanelAdmin />
}

function PanelAdmin() {
  const [usuarios, setUsuarios] = useLocalStorage('lug_users', [])
  const [ordenes, setOrdenes] = useLocalStorage('lug_orders', [])
  const [mensajes, setMensajes] = useLocalStorage('lug_mensajes', [])

  const ventas = ordenes.reduce((suma, orden) => suma + orden.total, 0)
  const sinLeer = mensajes.filter((m) => m.estado !== 'Leído').length

  const cambiarEstadoOrden = (id) =>
    setOrdenes(
      ordenes.map((o) => (o.id === id ? { ...o, estado: o.estado === 'Completado' ? 'Pendiente' : 'Completado' } : o))
    )

  const eliminarOrden = (id) => {
    if (window.confirm(`¿Eliminar la orden ${id}?`)) setOrdenes(ordenes.filter((o) => o.id !== id))
  }

  const eliminarUsuario = (email) => {
    if (window.confirm(`¿Eliminar al usuario ${email}?`)) setUsuarios(usuarios.filter((u) => u.email !== email))
  }

  const cambiarEstadoMensaje = (indice) =>
    setMensajes(
      mensajes.map((m, i) => (i === indice ? { ...m, estado: m.estado === 'Leído' ? 'Sin leer' : 'Leído' } : m))
    )

  const eliminarMensaje = (indice) => {
    if (window.confirm('¿Eliminar este mensaje?')) setMensajes(mensajes.filter((_, i) => i !== indice))
  }

  return (
    <Container className="my-5" data-bs-theme="dark">
      <h2>Panel de Administración</h2>
      <p className="text-secondary">Gestión de inventario, órdenes, usuarios y mensajes.</p>

      <Tabs defaultActiveKey="resumen" className="mb-4" mountOnEnter unmountOnExit>
        <Tab eventKey="resumen" title="Resumen">
          <Row xs={1} sm={2} lg={4} className="g-3">
            <Col>
              <Estadistica titulo="Usuarios registrados" valor={usuarios.length} />
            </Col>
            <Col>
              <Estadistica titulo="Órdenes realizadas" valor={ordenes.length} />
            </Col>
            <Col>
              <Estadistica titulo="Ventas totales" valor={pesos(ventas)} />
            </Col>
            <Col>
              <Estadistica titulo="Mensajes sin leer" valor={sinLeer} />
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="productos" title="Productos">
          <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>{pesos(p.precio)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="ordenes" title={`Órdenes (${ordenes.length})`}>
          <TablaOrdenes ordenes={ordenes} onCambiarEstado={cambiarEstadoOrden} onEliminar={eliminarOrden} />
        </Tab>

        <Tab eventKey="usuarios" title={`Usuarios (${usuarios.length})`}>
          <TablaUsuarios usuarios={usuarios} onEliminar={eliminarUsuario} />
        </Tab>

        <Tab eventKey="mensajes" title={`Mensajes (${sinLeer})`}>
          <TablaMensajes mensajes={mensajes} onCambiarEstado={cambiarEstadoMensaje} onEliminar={eliminarMensaje} />
        </Tab>
      </Tabs>
    </Container>
  )
}
