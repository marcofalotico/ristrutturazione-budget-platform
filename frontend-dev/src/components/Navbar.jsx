import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Hamburger from 'hamburger-react';
import { supabase } from '../SupabaseClient';
import logo from '../assets/planora_logo_square.png';

const MyNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setOpen] = useState(false);

  // ✅ Chiudi il menu mobile quando cambia pagina
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // ✅ Logout e redirect
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <>
      {/* ✅ Navbar principale */}
      <Navbar
        expand="lg"
        bg="light"
        className="mb-0 shadow-sm px-3"
        style={{
          backgroundColor: '#f8f9fa',
          zIndex: 1000,
          position: 'relative'
        }}
      >
        <Container fluid>
          {/* ✅ Logo + nome app */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
            <img src={logo} alt="Planora Logo" style={{ height: '50px' }} />
            <span className="fw-bold text-dark">PLANORA</span>
          </Navbar.Brand>

          {/* ✅ Hamburger solo su mobile */}
          <div className="d-lg-none ms-auto">
            <Hamburger
              toggled={isOpen}
              toggle={setOpen}
              size={24}
              direction="left"
              duration={0.4}
              type="tilt"
            />
          </div>

          {/* ✅ Navbar desktop */}
          <Navbar.Collapse className="d-none d-lg-flex justify-content-between">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/elenco">Elenco</Nav.Link>
              <Nav.Link as={Link} to="/inserisci">Inserisci Preventivo</Nav.Link>
              <Nav.Link as={Link} to="/spesa">Inserisci Spesa</Nav.Link>
              <Nav.Link as={Link} to="/grafici">Grafici</Nav.Link>
            </Nav>
            <Nav>
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ✅ Menu mobile (overlay a tutto schermo) */}
      {isOpen && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
          style={{
            zIndex: 999,
            backgroundColor: '#f8f9fa', // stesso colore navbar
            paddingTop: '120px',         // spazio extra per evitare che Dashboard venga coperto
            paddingInline: '1.5rem',
          }}
        >
          <Nav className="flex-column text-start">
            {/* <Nav.Link as={Link} to="/">Dashboard</Nav.Link> */}
            <Nav.Link as={Link} to="/elenco">Elenco</Nav.Link>
            <Nav.Link as={Link} to="/inserisci">Inserisci Preventivo</Nav.Link>
            <Nav.Link as={Link} to="/spesa">Inserisci Spesa</Nav.Link>
            <Nav.Link as={Link} to="/grafici">Grafici</Nav.Link>
            <Button variant="outline-danger" className="mt-3" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </div>
      )}
    </>
  );
};

export default MyNavbar;
