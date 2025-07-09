// ✅ Login.jsx
import { useState } from 'react';

// 👇 Legge l'API_URL dall'ambiente: se VITE_API_URL è definita lo usa, altrimenti fallback automatico.
const API_URL = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:8000/api'
    : 'https://TUO_USERNAME.pythonanywhere.com/api'
);

const Login = () => {
  // 👉 Creo gli state per username, password, messaggio di stato.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // ✅ Funzione chiamata quando invii il form di login.
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 👉 Chiamata POST all'endpoint /login/
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // ✅ Salvo il token access JWT nel localStorage.
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        setMessage('Login effettuato con successo!');
        console.log('Access Token:', data.access);

        // Esempio: prova subito a fare una GET autenticata!
        fetchProtectedData(data.access);
      } else {
        setMessage('Login fallito. Controlla username e password.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Errore di rete o server non raggiungibile.');
    }
  };

  // ✅ Esempio di fetch protetta usando il token JWT
  const fetchProtectedData = async (token) => {
    try {
      const response = await fetch(`${API_URL}/spese/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Dati protetti:', data);
        setMessage(`Ho ricevuto ${data.length} categorie`);
      } else {
        console.log('Errore fetch protetta');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
