import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { generarCodigoReferido, PUNTOS_POR_REFERIR, PUNTOS_POR_SER_REFERIDO } from '../utils/niveles.js'
import { esCorreoValido, esRunValido, limpiarRun, esFechaPasada } from '../utils/validaciones.js'
import { leerUsuarios } from '../utils/sesion.js'
import { regionesYComunas } from '../data/regiones.js'

// Crea un código de referido que ningún otro usuario tenga.
const codigoNuevo = (usuarios) => {
  let codigo = generarCodigoReferido()
  while (usuarios.some((u) => u.codigoReferido === codigo)) codigo = generarCodigoReferido()
  return codigo
}

const formularioVacio = {
  run: '',
  nombre: '',
  apellidos: '',
  email: '',
  password: '',
  fechaNacimiento: '',
  region: '',
  comuna: '',
  direccion: '',
  referido: '',
}

// Campo reutilizable: etiqueta + control + mensaje de error.
function Campo({ id, etiqueta, error, ayuda, children }) {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{etiqueta}</Form.Label>
      {children}
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      {ayuda && !error && <Form.Text className="text-secondary">{ayuda}</Form.Text>}
    </Form.Group>
  )
}

export default function Registro() {
  const [datos, setDatos] = useState(formularioVacio)
  const [errores, setErrores] = useState({})
  const navigate = useNavigate()

  // Un solo manejador para todos los campos: usa el atributo "name" del input.
  const cambiar = (e) => {
    const { name, value } = e.target
    setDatos((anterior) => ({
      ...anterior,
      [name]: value,
      // Al cambiar de región, la comuna elegida deja de ser válida.
      ...(name === 'region' ? { comuna: '' } : {}),
    }))
  }

  const codigoIngresado = datos.referido.trim().toUpperCase()
  const comunas = regionesYComunas[datos.region] || []

  const validar = () => {
    const e = {}
    const usuarios = leerUsuarios()

    if (!datos.run.trim()) e.run = 'El RUN es obligatorio.'
    else if (!esRunValido(datos.run)) e.run = 'El RUN no es válido.'
    else if (usuarios.some((u) => u.run === limpiarRun(datos.run))) e.run = 'Ese RUN ya está registrado.'

    if (!datos.nombre.trim()) e.nombre = 'El nombre es obligatorio.'
    if (!datos.apellidos.trim()) e.apellidos = 'Los apellidos son obligatorios.'

    if (!esCorreoValido(datos.email)) e.email = 'Ingresa un correo válido.'
    else if (usuarios.some((u) => u.email === datos.email)) e.email = 'Ese correo ya está registrado.'

    if (datos.password.length < 4 || datos.password.length > 10) {
      e.password = 'La contraseña debe tener entre 4 y 10 caracteres.'
    }

    if (!datos.fechaNacimiento) e.fechaNacimiento = 'Selecciona tu fecha de nacimiento.'
    else if (!esFechaPasada(datos.fechaNacimiento)) e.fechaNacimiento = 'La fecha no puede ser posterior a hoy.'

    if (!datos.region) e.region = 'Selecciona una región.'
    if (!datos.comuna) e.comuna = 'Selecciona una comuna.'
    if (!datos.direccion.trim()) e.direccion = 'La dirección es obligatoria.'

    if (codigoIngresado && !usuarios.some((u) => u.codigoReferido === codigoIngresado)) {
      e.referido = 'El código de referido no existe.'
    }
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validar()
    setErrores(e)
    if (Object.keys(e).length > 0) return

    // Si usó un código válido, quien lo invitó gana puntos y el nuevo usuario también.
    const usuarios = leerUsuarios().map((u) =>
      codigoIngresado && u.codigoReferido === codigoIngresado
        ? { ...u, puntos: (u.puntos ?? 0) + PUNTOS_POR_REFERIR }
        : u
    )
    usuarios.push({
      run: limpiarRun(datos.run),
      nombre: `${datos.nombre.trim()} ${datos.apellidos.trim()}`,
      email: datos.email,
      password: datos.password,
      fechaNacimiento: datos.fechaNacimiento,
      region: datos.region,
      comuna: datos.comuna,
      direccion: datos.direccion.trim(),
      role: 'cliente',
      puntos: codigoIngresado ? PUNTOS_POR_SER_REFERIDO : 0,
      codigoReferido: codigoNuevo(usuarios),
    })
    localStorage.setItem('lug_users', JSON.stringify(usuarios))
    navigate('/login')
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card bg="dark" text="light" className="p-4 shadow">
            <h2 className="text-center mb-4">Registrar Usuario</h2>

            {Object.keys(errores).length > 0 && (
              <Alert variant="danger" className="py-2">
                Revisa los campos marcados.
              </Alert>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              <Row>
                <Col md={6}>
                  <Campo id="regRun" etiqueta="RUN" error={errores.run}>
                    <Form.Control name="run" value={datos.run} onChange={cambiar} placeholder="12345678-5" isInvalid={!!errores.run} />
                  </Campo>
                </Col>
                <Col md={6}>
                  <Campo id="regFecha" etiqueta="Fecha de Nacimiento" error={errores.fechaNacimiento}>
                    <Form.Control
                      type="date"
                      name="fechaNacimiento"
                      value={datos.fechaNacimiento}
                      onChange={cambiar}
                      isInvalid={!!errores.fechaNacimiento}
                    />
                  </Campo>
                </Col>
                <Col md={6}>
                  <Campo id="regNombre" etiqueta="Nombre" error={errores.nombre}>
                    <Form.Control name="nombre" value={datos.nombre} onChange={cambiar} isInvalid={!!errores.nombre} />
                  </Campo>
                </Col>
                <Col md={6}>
                  <Campo id="regApellidos" etiqueta="Apellidos" error={errores.apellidos}>
                    <Form.Control name="apellidos" value={datos.apellidos} onChange={cambiar} isInvalid={!!errores.apellidos} />
                  </Campo>
                </Col>
                <Col md={6}>
                  <Campo id="regEmail" etiqueta="Correo Electrónico" error={errores.email}>
                    <Form.Control
                      type="email"
                      name="email"
                      value={datos.email}
                      onChange={cambiar}
                      placeholder="correo@duoc.cl"
                      isInvalid={!!errores.email}
                    />
                  </Campo>
                </Col>
                <Col md={6}>
                  <Campo id="regPassword" etiqueta="Contraseña" error={errores.password} ayuda="Entre 4 y 10 caracteres.">
                    <Form.Control
                      type="password"
                      name="password"
                      value={datos.password}
                      onChange={cambiar}
                      isInvalid={!!errores.password}
                    />
                  </Campo>
                </Col>
                <Col md={6}>
                  <Campo id="regRegion" etiqueta="Región" error={errores.region}>
                    <Form.Select name="region" value={datos.region} onChange={cambiar} isInvalid={!!errores.region}>
                      <option value="">Seleccione una región</option>
                      {Object.keys(regionesYComunas).map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </Form.Select>
                  </Campo>
                </Col>
                <Col md={6}>
                  <Campo id="regComuna" etiqueta="Comuna" error={errores.comuna}>
                    <Form.Select
                      name="comuna"
                      value={datos.comuna}
                      onChange={cambiar}
                      disabled={!datos.region}
                      isInvalid={!!errores.comuna}
                    >
                      <option value="">{datos.region ? 'Seleccione una comuna' : 'Primero seleccione una región'}</option>
                      {comunas.map((comuna) => (
                        <option key={comuna} value={comuna}>
                          {comuna}
                        </option>
                      ))}
                    </Form.Select>
                  </Campo>
                </Col>
                <Col xs={12}>
                  <Campo id="regDireccion" etiqueta="Dirección" error={errores.direccion}>
                    <Form.Control name="direccion" value={datos.direccion} onChange={cambiar} isInvalid={!!errores.direccion} />
                  </Campo>
                </Col>
                <Col xs={12}>
                  <Campo
                    id="regReferido"
                    etiqueta="Código de referido (opcional)"
                    error={errores.referido}
                    ayuda={`Si un amigo te invitó, ganas ${PUNTOS_POR_SER_REFERIDO} puntos y él gana ${PUNTOS_POR_REFERIR}.`}
                  >
                    <Form.Control
                      name="referido"
                      value={datos.referido}
                      onChange={cambiar}
                      placeholder="LUG-1234"
                      isInvalid={!!errores.referido}
                    />
                  </Campo>
                </Col>
              </Row>

              <Button type="submit" variant="primary" className="w-100 mt-2">
                Registrarse
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
