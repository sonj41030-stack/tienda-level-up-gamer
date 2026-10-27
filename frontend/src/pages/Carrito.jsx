import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap'
import { useCarrito } from '../context/CarritoContext.jsx'
import { leerSesion, puntosDeSesion } from '../utils/sesion.js'
import { obtenerNivel } from '../utils/niveles.js'
import { guardarOrden } from '../utils/ordenes.js'

const pesos = (n) => `$${n.toLocaleString('es-CL')}`

export default function Carrito() {
  const { carrito, eliminar, actualizarCantidad, vaciarCarrito, totalPrecio } = useCarrito()
  // Orden recién creada (para mostrar la confirmación después de comprar)
  const [orden, setOrden] = useState(null)

  // Los usuarios Pro Gamer y Leyenda tienen descuento según su nivel LevelUp.
  const sesion = leerSesion()
  const nivel = obtenerNivel(puntosDeSesion())
  const descuento = Math.round((totalPrecio * nivel.descuento) / 100)
  const total = totalPrecio - descuento

  const finalizarCompra = () => {
    setOrden(guardarOrden({ carrito, sesion, subtotal: totalPrecio, descuento }))
    vaciarCarrito()
  }

  if (orden) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card bg="dark" text="light" className="p-4 text-center border-success shadow">
              <h2 className="mb-3">¡Compra realizada!</h2>
              <p className="mb-1">
                Tu número de orden es <strong>{orden.id}</strong>
              </p>
              <p className="mb-4">
                Total pagado: <strong>{pesos(orden.total)}</strong>
              </p>
              <Link to="/productos" className="btn-primary">
                Seguir comprando
              </Link>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }

  if (carrito.length === 0) {
    return (
      <Container className="my-5 text-center">
        <h2>Tu Carrito de Compras</h2>
        <p className="my-4">El carrito está vacío.</p>
        <Link to="/productos" className="btn-primary">
          Ver Productos
        </Link>
      </Container>
    )
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">Tu Carrito de Compras</h2>
      <Row className="g-4">
        <Col xs={12} lg={8}>
          {carrito.map((item) => (
            <Card key={item.id} bg="dark" text="light" className="mb-3">
              <Card.Body>
                <Row className="align-items-center g-3">
                  <Col xs={4} md={2}>
                    <img src={item.imagen} alt={item.nombre} className="img-fluid rounded" />
                  </Col>
                  <Col xs={8} md={4}>
                    <h4 className="fs-6 mb-1">{item.nombre}</h4>
                    <p className="mb-0 text-secondary">{pesos(item.precio)}</p>
                  </Col>
                  <Col xs={6} md={3}>
                    <ButtonGroup aria-label={`Cantidad de ${item.nombre}`} className="align-items-center">
                      <Button variant="outline-light" size="sm" onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}>
                        -
                      </Button>
                      <span className="px-3">{item.cantidad}</span>
                      <Button variant="outline-light" size="sm" onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}>
                        +
                      </Button>
                    </ButtonGroup>
                  </Col>
                  <Col xs={6} md={3} className="text-end">
                    <p className="fw-bold mb-1">{pesos(item.precio * item.cantidad)}</p>
                    <Button variant="outline-danger" size="sm" onClick={() => eliminar(item.id)}>
                      Eliminar
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Col>

        <Col xs={12} lg={4}>
          <Card bg="dark" text="light" className="p-3">
            <h3 className="fs-5 mb-3">Resumen</h3>
            {descuento > 0 && (
              <>
                <p className="d-flex justify-content-between mb-1">
                  <span>Subtotal</span>
                  <span>{pesos(totalPrecio)}</span>
                </p>
                <p className="d-flex justify-content-between text-success mb-2">
                  <span>
                    Descuento {nivel.nombre} ({nivel.descuento}%)
                  </span>
                  <span>-{pesos(descuento)}</span>
                </p>
              </>
            )}
            <p className="fs-5 fw-bold">Total: {pesos(total)}</p>
            <div className="d-grid gap-2">
              <Button variant="primary" onClick={finalizarCompra}>
                Finalizar Compra
              </Button>
              <Button variant="secondary" onClick={vaciarCarrito}>
                Vaciar Carrito
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
