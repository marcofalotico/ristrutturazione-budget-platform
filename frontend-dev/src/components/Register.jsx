// ✅ src/components/Register.jsx
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

    // ✅ Prova a fare signUp normalmente
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    console.log('Sign-up response:', response);

    // ✅ Se c'è un utente creato
    if (response.data && response.data.user) {
      console.log('Identities:', response.data.user.identities);

      if (response.data.user.identities && response.data.user.identities.length > 0) {
        // ✅ Utente nuovo → registrazione OK
        setMessage('Registrazione completata! Controlla la tua email per confermare.');
      } else {
        // ✅ Utente esiste già → faccio login automatico
        setMessage('Email già registrata. Provo accesso automatico...');

        const signInResponse = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInResponse.error) {
          console.error('Errore login:', signInResponse.error.message);
          setMessage('Email già registrata. Password errata o account già esistente.');
        } else {
          console.log('Login automatico OK');
          setMessage('Accesso effettuato con successo!');
          navigate('/'); // ✅ Vai alla homepage o dove vuoi
        }
      }
    } else {
      // ✅ Se signup fallisce per altri motivi
      console.error('Errore signUp:', response.error?.message);
      setMessage('Errore: ' + response.error?.message);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center mt-5">
      <Row>
        <Col>
          <Card className="shadow p-4">
            <h2 className="mb-4 text-center">Registrati</h2>
            {message && (
              <Alert
                variant={
                  message.includes('Errore') || message.includes('errata')
                    ? 'danger'
                    : 'success'
                }
              >
                {message}
              </Alert>
            )}

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
              <small>
                Hai già un account? <a href="/login">Accedi</a>
              </small>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
