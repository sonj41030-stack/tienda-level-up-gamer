import { useMemo, useState } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import ProductCard from '../components/ProductCard.jsx'
import { productos } from '../data/productos.js'

export default function Productos() {
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('default')

  const lista = useMemo(() => {
    let resultado = productos.filter((p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )
    if (orden === 'price-asc') resultado = [...resultado].sort((a, b) => a.precio - b.precio)
    if (orden === 'price-desc') resultado = [...resultado].sort((a, b) => b.precio - a.precio)
    return resultado
  }, [busqueda, orden])

  return (
    <Container className="my-5">
      <h3 className="text-center mb-4">Nuestro Catálogo</h3>

      <Row className="g-3 mb-4 justify-content-center">
        <Col xs={12} md={6} lg={5}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre de producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </Col>
        <Col xs={12} md={4} lg={3}>
          <Form.Select value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="default">Ordenar por precio</option>
            <option value="price-asc">Menor a Mayor</option>
            <option value="price-desc">Mayor a Menor</option>
          </Form.Select>
        </Col>
      </Row>

      {lista.length === 0 && (
        <p className="text-center">No se encontraron productos.</p>
      )}

      <Row xs={1} sm={2} lg={4} className="g-4">
        {lista.map((p) => (
          <Col key={p.id}>
            <ProductCard producto={p} mostrarDescripcion />
          </Col>
        ))}
      </Row>
    </Container>
  )
}