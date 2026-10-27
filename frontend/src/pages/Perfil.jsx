import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Alert, ProgressBar } from 'react-bootstrap'
import {
  obtenerNivel,
  siguienteNivel,
  PUNTOS_POR_CANJE,
  PUNTOS_POR_REFERIR,
  VALOR_CUPON,
} from '../utils/niveles.js'

const leerUsuarios = () => JSON.parse(localStorage.getItem('lug_users') || '[]')

// Junta la sesión activa con los datos guardados del usuario (puntos y código).
const cargarUsuario = () => {
  const sesion = JSON.parse(localStorage.getItem('lug_current_user') || 'null')
  if (!sesion) return null
  const guardado = leerUsuarios().find((u) => u.email === sesion.email) || {}
  return {
    nombre: guardado.nombre || sesion.nombre || sesion.email,
    email: sesion.email,
    puntos: guardado.puntos ?? 0,
    codigoReferido: guardado.codigoReferido ?? null,
  }
}

const pesos = (n) => `$${n.toLocaleString('es-CL')}`

export default function Perfil() {
  const [usuario, setUsuario] = useState(cargarUsuario)
  const [aviso, setAviso] = useState(null)

  // Sin sesión iniciada, el perfil no se puede ver: se envía al login.
  if (!usuario) return <Navigate to="/login" replace />

  const nivel = obtenerNivel(usuario.puntos)
  const proximo = siguienteNivel(usuario.puntos)
  const avance = proximo
    ? Math.round(((usuario.puntos - nivel.minimo) / (proximo.minimo - nivel.minimo)) * 100)
    : 100

  const canjear = () => {
    if (usuario.puntos < PUNTOS_POR_CANJE) {
      setAviso({
        tipo: 'warning',
        texto: `Puntos insuficientes. Necesitas al menos ${PUNTOS_POR_CANJE} puntos para canjear.`,
      })
      return
    }

    const puntos = usuario.puntos - PUNTOS_POR_CANJE
    const usuarios = leerUsuarios().map((u) => (u.email === usuario.email ? { ...u, puntos } : u))
    localStorage.setItem('lug_users', JSON.stringify(usuarios))
    setUsuario({ ...usuario, puntos })
    setAviso({
      tipo: 'success',
      texto: `Canjeaste ${PUNTOS_POR_CANJE} puntos por un cupón de ${pesos(VALOR_CUPON)}.`,
    })
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <div className="blogs-header mb-4">
            <h2>
              Mi Perfil <span>LevelUp</span>
            </h2>
          </div>

          <Card bg="dark" text="light" className="p-4 shadow border-info">
            <div className="border-bottom border-secondary pb-3 mb-4">
              <h3 className="text-info mb-1">{usuario.nombre}</h3>
              <p className="text-secondary mb-0">{usuario.email}</p>
            </div>

            <Row xs={1} sm={2} className="g-3 mb-4 text-center">
              <Col>
                <div className="bg-black rounded p-3 h-100">
                  <small className="text-secondary">Nivel actual</small>
                  <h4 className="mt-1 mb-0">{nivel.nombre}</h4>
                  {nivel.descuento > 0 && <small className="text-success">{nivel.descuento}% de descuento</small>}
                </div>
              </Col>
              <Col>
                <div className="bg-black rounded p-3 h-100">
                  <small className="text-secondary">Puntos acumulados</small>
                  <h4 className="mt-1 mb-0 text-info">{usuario.puntos} Pts</h4>
                </div>
              </Col>
            </Row>

            <div className="mb-4">
              <ProgressBar now={avance} variant="info" aria-label="Avance al siguiente nivel" />
              <small className="text-secondary">
                {proximo
                  ? `Te faltan ${proximo.minimo - usuario.puntos} puntos para llegar a ${proximo.nombre}.`
                  : '¡Llegaste al nivel máximo!'}
              </small>
            </div>

            <div className="text-center border border-secondary rounded p-3 mb-4">
              <h4 className="fs-6">Tu código de referido</h4>
              <p className="small text-secondary mb-2">
                Comparte este código con tus amigos para ganar {PUNTOS_POR_REFERIR} puntos por cada registro.
              </p>
              <div className="fs-3 text-info">
                {usuario.codigoReferido || '—'}
              </div>
            </div>

            <div className="text-center">
              <h4 className="fs-6">Canjear puntos</h4>
              <p className="small text-secondary">
                Canjea {PUNTOS_POR_CANJE} puntos por {pesos(VALOR_CUPON)} CLP de descuento directo.
              </p>
              {aviso && (
                <Alert variant={aviso.tipo} className="py-2">
                  {aviso.texto}
                </Alert>
              )}
              <Button variant="secondary" onClick={canjear}>
                Canjear {PUNTOS_POR_CANJE} Puntos
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
