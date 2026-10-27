import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const usuarios = JSON.parse(localStorage.getItem('lug_users') || '[]')
    const encontrado = usuarios.find((u) => u.email === email && u.password === password)

    if (!encontrado) {
      setError('Correo o contraseña incorrectos.')
      return
    }

    const { nombre, role } = encontrado
    localStorage.setItem('lug_current_user', JSON.stringify({ nombre, email, role }))
    navigate('/')
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={5}>
          <Card bg="dark" text="light" className="p-4 shadow">
            <h2 className="text-center mb-4">Iniciar Sesión</h2>

            {error && (
              <Alert variant="danger" className="py-2">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@duoc.cl"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4" controlId="loginPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100">
                Ingresar
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}