import { Container, Row, Col, Card } from 'react-bootstrap'

const pilares = [
  {
    icono: '🚀',
    titulo: 'Nuestra Misión',
    texto: 'Proveer a los jugadores chilenos con los mejores productos de la industria, garantizando calidad, precios justos y una atención al cliente de nivel legendario.',
  },
  {
    icono: '👁️',
    titulo: 'Nuestra Visión',
    texto: 'Ser reconocidos como la tienda y comunidad gamer número uno de Latinoamérica, donde cada jugador sienta que ha encontrado su verdadero equipo.',
  },
  {
    icono: '⚔️',
    titulo: 'Nuestros Valores',
    texto: 'Pasión, innovación, comunidad y transparencia. Jugamos limpio en el competitivo y en los negocios. ¡Tu experiencia es nuestra máxima prioridad!',
  },
]

const equipo = [
  { nombre: 'Andre Ruz', cargo: 'Fundador & CEO' },
  { nombre: 'Ariel Velasquez', cargo: 'Jefe de Operaciones' },
  { nombre: 'Edixon Cabriles', cargo: 'Soporte Técnico' },
]

const iniciales = (nombre) =>
  nombre
    .split(' ')
    .map((parte) => parte[0])
    .join('')

export default function Nosotros() {
  return (
    <main>
      <section className="about-hero">
        <h2>
          Nuestra <span>Historia</span>
        </h2>
        <p>
          Nacimos en 2020 como un pequeño grupo de amigos apasionados por el gaming y los juegos de mesa. Hoy,{' '}
          <strong>Level-Up Gamer</strong> es el epicentro donde la comunidad encuentra el mejor hardware, accesorios y
          aventuras para llevar su nivel al máximo.
        </p>
      </section>

      <Container className="py-5">
        <Row xs={1} md={3} className="g-4">
          {pilares.map((pilar) => (
            <Col key={pilar.titulo}>
              <Card className="about-card h-100" text="light">
                <div className="icon" aria-hidden="true">
                  {pilar.icono}
                </div>
                <h3>{pilar.titulo}</h3>
                <p>{pilar.texto}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <section className="team-section">
        <h3>
          Conoce al <span>Equipo</span>
        </h3>
        <Container>
          <Row xs={1} sm={2} lg={3} className="g-4 justify-content-center">
            {equipo.map((persona) => (
              <Col key={persona.nombre} className="d-flex justify-content-center">
                <div className="team-member w-100">
                  <div className="team-photo-placeholder" aria-hidden="true">
                    {iniciales(persona.nombre)}
                  </div>
                  <h4>{persona.nombre}</h4>
                  <p>{persona.cargo}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </main>
  )
}
