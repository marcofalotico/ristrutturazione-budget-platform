// src/components/Register.jsx
import { useState } from 'react';
import { supabase } from '../SupabaseClient';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Registrazione completata! Controlla la tua email per confermare.');
      // ✅ Puoi decidere di reindirizzare subito:
      // navigate('/login');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center mt-5">
      <Row>
        <Col>
          <Card className="shadow p-4">
            <h2 className="mb-4 text-center">Registrati</h2>
            {message && <Alert variant={message.includes('Registrazione') ? 'success' : 'danger'}>{message}</Alert>}

            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Inserisci email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Crea una password sicura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-grid">
                <Button type="submit" variant="success">
                  Registrati
                </Button>
              </div>
            </Form>

            <div className="text-center mt-3">
              <small>Hai già un account? <a href="/login">Accedi</a></small>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
