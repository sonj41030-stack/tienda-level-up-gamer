import { Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'

export default function NoEncontrada() {
  return (
    <Container className="my-5 text-center">
      <h2>Página no encontrada</h2>
      <p className="text-secondary">La dirección que buscas no existe o fue movida.</p>
      <Link to="/" className="btn-primary">
        Volver al inicio
      </Link>
    </Container>
  )
}
