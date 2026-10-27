import { Card, Button } from 'react-bootstrap'

// Tarjeta de un artículo. Recibe el artículo por props y avisa al padre
// con la función onLeer cuando el usuario quiere leerlo completo.
export default function BlogCard({ articulo, onLeer }) {
  return (
    <Card bg="dark" text="light" className="blog-card h-100">
      <Card.Img variant="top" src={articulo.imagen} alt={articulo.titulo} className="blog-card-img" />
      <Card.Body className="d-flex flex-column">
        <Card.Subtitle className="blog-date">
          {articulo.categoria} • {articulo.fecha}
        </Card.Subtitle>
        <Card.Title as="h3" className="fs-5">{articulo.titulo}</Card.Title>
        <Card.Text className="text-secondary flex-grow-1">{articulo.resumen}</Card.Text>
        <Button variant="secondary" className="w-100" onClick={() => onLeer(articulo)}>
          Leer artículo
        </Button>
      </Card.Body>
    </Card>
  )
}
