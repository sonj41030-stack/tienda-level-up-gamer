import { useState } from 'react'
import { Container, Row, Col, Modal, Button } from 'react-bootstrap'
import BlogCard from '../components/BlogCard.jsx'
import { articulos } from '../data/blogs.js'

export default function Blogs() {
  // Artículo que se está leyendo en el modal (null = modal cerrado)
  const [abierto, setAbierto] = useState(null)
  const cerrar = () => setAbierto(null)

  return (
    <Container className="my-5">
      <div className="blogs-header">
        <h2>
          Novedades y <span>Noticias</span>
        </h2>
        <p>Mantente al día con las últimas reseñas, parches y lanzamientos del mundo gamer y los juegos de mesa.</p>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {articulos.map((articulo) => (
          <Col key={articulo.id}>
            <BlogCard articulo={articulo} onLeer={setAbierto} />
          </Col>
        ))}
      </Row>

      <Modal show={abierto !== null} onHide={cerrar} centered size="lg" contentClassName="blog-modal-content">
        {abierto && (
          <>
            <Modal.Header closeButton closeVariant="white">
              <div>
                <span className="modal-date">
                  {abierto.categoria} • {abierto.fecha}
                </span>
                <Modal.Title>{abierto.titulo}</Modal.Title>
              </div>
            </Modal.Header>
            <Modal.Body className="blog-modal-body">{abierto.contenido}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={cerrar}>
                Cerrar
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  )
}
