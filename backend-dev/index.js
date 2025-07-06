// ✅ Import moduli principali
require('dotenv').config(); // Legge variabili da .env
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// ✅ Inizializza Express
const app = express();

// ✅ Porta: .env o fallback 3001
const PORT = process.env.PORT || 3001;

// ✅ Middleware CORS + JSON parser
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./ristrutturazione.db')

// ✅ Rotta di test
app.get('/', (req, res) => {
  res.send('✅ Backend funzionante!');
});

/* ----------------- API ----------------- */

// ✅ [GET] Tutte le categorie
app.get('/api/categorie', (req, res) => {
  const query = `SELECT * FROM categorie ORDER BY id ASC`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: '❌ Errore recupero categorie' });
    } else {
      res.json(rows);
    }
  });
});

// ✅ [POST] Nuova categoria
app.post('/api/categorie', (req, res) => {
  const { nome, costo_max, macro_area, note } = req.body;

  const query = `
    INSERT INTO categorie (nome, costo_max, macro_area, note)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [nome, costo_max, macro_area, note], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: '❌ Errore inserimento categoria' });
    } else {
      res.status(201).json({ message: '✅ Categoria inserita', id: this.lastID });
    }
  });
});

// ✅ [PUT] Modifica categoria completa
app.put('/api/categorie/:id', (req, res) => {
  const id = req.params.id;
  const { nome, costo_max, macro_area, note, costo_effettivo } = req.body;

  const query = `
    UPDATE categorie
    SET nome = ?, costo_max = ?, macro_area = ?, note = ?, costo_effettivo = ?
    WHERE id = ?
  `;

  db.run(query, [nome, costo_max, macro_area, note, costo_effettivo, id], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: '❌ Errore aggiornamento categoria' });
    } else {
      res.json({
        message: '✅ Categoria aggiornata con successo',
        changes: this.changes
      });
    }
  });
});

/* ----------------- ⚠️ Niente serve static ⚠️ ----------------- */
// Non serve Express static: frontend deploy separato con Vite!

/* ----------------- Avvio ----------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server backend attivo su http://localhost:${PORT}`);
});
