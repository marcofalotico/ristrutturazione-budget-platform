// src/components/Navbar.jsx
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../SupabaseClient';

const MyNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login'); // Dopo logout ➜ vai al login
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">🏠 Ristrutturazione</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/elenco">Elenco</Nav.Link>
            <Nav.Link as={Link} to="/inserisci">Inserisci Preventivo</Nav.Link>
            <Nav.Link as={Link} to="/spesa">Inserisci Spesa</Nav.Link>
            <Nav.Link as={Link} to="/grafici">Grafici</Nav.Link>
          </Nav>

          <Nav>
            {/* ✅ Bottone Logout a destra */}
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
