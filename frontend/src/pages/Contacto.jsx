import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'

export default function Contacto() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)

  const validar = () => {
    const e = {}
    if (nombre.trim().length < 3) e.nombre = 'El nombre debe tener al menos 3 caracteres.'
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Ingresa un correo válido.'
    if (mensaje.trim().length < 10) e.mensaje = 'El mensaje debe tener al menos 10 caracteres.'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validar()
    setErrores(e)
    setEnviado(false)
    if (Object.keys(e).length > 0) return

    const mensajes = JSON.parse(localStorage.getItem('lug_mensajes') || '[]')
    mensajes.push({ nombre: nombre.trim(), email, mensaje: mensaje.trim(), fecha: new Date().toISOString() })
    localStorage.setItem('lug_mensajes', JSON.stringify(mensajes))

    setNombre('')
    setEmail('')
    setMensaje('')
    setEnviado(true)
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card bg="dark" text="light" className="p-4 shadow">
            <h2 className="text-center mb-2">Contacto</h2>
            <p className="text-center mb-4">¿Tienes dudas o consultas? Envíanos un mensaje.</p>

            {enviado && (
              <Alert variant="success" className="py-2">
                ¡Mensaje enviado! Te responderemos pronto.
              </Alert>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3" controlId="contNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  isInvalid={!!errores.nombre}
                />
                <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="contEmail">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@duoc.cl"
                  isInvalid={!!errores.email}
                />
                <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="contMensaje">
                <Form.Label>Mensaje</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  isInvalid={!!errores.mensaje}
                />
                <Form.Control.Feedback type="invalid">{errores.mensaje}</Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">
                Enviar
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
