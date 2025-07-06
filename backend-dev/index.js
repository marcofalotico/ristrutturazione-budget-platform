// ✅ Import dei moduli principali
require('dotenv').config(); // Carica variabili da .env
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// ✅ Inizializza app Express
const app = express();

// ✅ Porta dinamica: usa PORT da .env o 3001 in locale
const PORT = process.env.PORT || 3001;

// ✅ Middleware: CORS + parsing JSON
app.use(cors());
app.use(express.json());

// ✅ Connessione al database SQLite (percorsi diversi possibili)
const dbPath = process.env.DB_PATH || path.resolve(__dirname, 'ristrutturazione.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Errore connessione al database:', err);
  } else {
    console.log(`✅ Connesso a SQLite DB: ${dbPath}`);
  }
});

// ✅ Rotta di test
app.get('/', (req, res) => {
  res.send('Backend funzionante ✅');
});

/* ---------- ROTTE API ---------- */

// ✅ [GET] Tutte le categorie
app.get('/api/categorie', (req, res) => {
  const query = `SELECT * FROM categorie ORDER BY id ASC`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: '❌ Errore nel recupero categorie' });
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

// ✅ [PUT] Modifica categoria (tutti i campi)
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

/* ---------- SERVE IL FRONTEND IN PRODUZIONE (opzionale) ---------- */

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Catch-all per SPA React Router
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

/* ---------- AVVIO SERVER ---------- */

app.listen(PORT, () => {
  console.log(`🚀 Server in ascolto sulla porta ${PORT}`);
});
