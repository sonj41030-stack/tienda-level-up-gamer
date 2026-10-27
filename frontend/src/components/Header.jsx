import { useState } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { useCarrito } from '../context/CarritoContext.jsx'
import { leerSesion, esAdmin } from '../utils/sesion.js'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { totalItems } = useCarrito()
  const [user, setUser] = useState(leerSesion)
  const [rutaAnterior, setRutaAnterior] = useState(location.pathname)

  // Cuando cambia la ruta (por ejemplo, después de iniciar sesión)
  // se vuelve a leer la sesión guardada para actualizar el menú.
  if (rutaAnterior !== location.pathname) {
    setRutaAnterior(location.pathname)
    setUser(leerSesion())
  }

  const administrador = esAdmin(user)
  const nombre = user ? (user.nombre ? user.nombre.split(' ')[0] : user.email.split('@')[0]) : ''

  const cerrarSesion = (e) => {
    e.preventDefault()
    localStorage.removeItem('lug_current_user')
    setUser(null)
    alert('Has cerrado sesión correctamente.')
    navigate('/')
  }

  return (
    <Navbar expand="lg" bg="dark" variant="dark" sticky="top" collapseOnSelect className="border-bottom border-success">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          LEVEL-UP <span style={{ color: '#00ffc8' }}>GAMER</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/blogs">Blogs</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
          </Nav>
          <Nav className="align-items-lg-center">
            {user ? (
              <>
                <Navbar.Text className="fw-bold me-lg-3" style={{ color: '#00ffc8' }}>
                  Hola, {nombre}
                </Navbar.Text>
                {administrador ? (
                  <Nav.Link as={Link} to="/admin" className="text-warning fw-bold">Panel Admin</Nav.Link>
                ) : (
                  <Nav.Link as={Link} to="/perfil">Mi Perfil</Nav.Link>
                )}
                <Nav.Link href="#" onClick={cerrarSesion} className="text-danger">Cerrar sesión</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Iniciar sesión</Nav.Link>
                <Nav.Link as={Link} to="/registro">Registrar usuario</Nav.Link>
              </>
            )}
            <Nav.Link as={Link} to="/carrito" className="fw-bold">🛒 Cart ({totalItems})</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
