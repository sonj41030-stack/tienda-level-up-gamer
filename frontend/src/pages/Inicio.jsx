import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import ProductCard from '../components/ProductCard.jsx'
import { productos } from '../data/productos.js'

export default function Inicio() {
  const destacados = productos.slice(0, 4)

  return (
    <>
      <section className="hero-banner py-5">
        <Container>
          <Row className="align-items-center g-4">
            <Col xs={12} lg={6} className="text-center text-lg-start">
              <h2 className="mb-3">¡Desafía tus límites con Level-Up Gamer!</h2>
              <p className="fs-5 mb-4">
                Conviértete en el héroe de tu propia historia y únete a nuestra comunidad de jugadores. ¡Explora, juega y
                gana con nosotros!
              </p>
              <Link to="/productos" className="btn-primary">
                Ver productos
              </Link>
            </Col>
            <Col xs={12} lg={6}>
              <img src="/images/tienda.jpg" alt="Banner Level-Up Gamer" className="img-fluid rounded" />
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="my-5">
        <h3 className="text-center fs-2 mb-4">Productos Destacados</h3>
        <Row xs={1} sm={2} lg={4} className="g-4">
          {destacados.map((p) => (
            <Col key={p.id}>
              <ProductCard producto={p} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  )
}
