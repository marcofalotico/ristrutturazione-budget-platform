import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const MyNavbar = () => {
  return (
    <Navbar bg="light" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand href="/">🏠 Ristrutturazione</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/elenco">Elenco</Nav.Link>
            <Nav.Link as={Link} to="/inserisci">Inserisci Preventivo</Nav.Link>
            <Nav.Link as={Link} to="/spesa">Inserisci Spesa</Nav.Link>
            <Nav.Link as={Link} to="/grafici">Grafici</Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default MyNavbar
