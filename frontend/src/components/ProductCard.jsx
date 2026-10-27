import { useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import { useCarrito } from '../context/CarritoContext.jsx'

export default function ProductCard({ producto, mostrarDescripcion = false }) {
  const { agregar } = useCarrito()
  const [agregado, setAgregado] = useState(false)

  const handleAgregar = () => {
    agregar(producto)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1200)
  }

  return (
    <Card bg="dark" text="light" className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={producto.imagen}
        alt={producto.alt}
        style={{ objectFit: 'cover', height: '220px' }}
      />
      <Card.Body className="d-flex flex-column text-center">
        <Card.Title as="h4">{producto.nombre}</Card.Title>
        <Card.Subtitle className="mb-2 text-info small">{producto.categoria}</Card.Subtitle>
        {mostrarDescripcion && <Card.Text className="small">{producto.descripcion}</Card.Text>}
        <Card.Text className="fw-bold fs-5 mt-auto">
          ${producto.precio.toLocaleString('es-CL')}
        </Card.Text>
        <Button
          variant={agregado ? 'success' : 'outline-success'}
          className="w-100"
          onClick={handleAgregar}
        >
          {agregado ? '¡Añadido!' : 'Añadir al carrito'}
        </Button>
      </Card.Body>
    </Card>
  )
}
