const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Connessione al DB SQLite
const dbPath = path.resolve(__dirname, 'ristrutturazione.db')
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Errore connessione al database', err)
  } else {
    console.log('✅ Connesso a ristrutturazione.db')
  }
})

// Rotta di test
app.get('/', (req, res) => {
  res.send('Backend funzionante ✅')
})

/* ---------- ROTTE API ---------- */

// ✅ GET tutte le categorie
app.get('/api/categorie', (req, res) => {
  const query = `SELECT * FROM categorie ORDER BY id ASC`
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Errore nel recupero categorie' })
    } else {
      res.json(rows)
    }
  })
})

// ✅ POST nuova categoria
app.post('/api/categorie', (req, res) => {
  const { nome, costo_max, macro_area, note } = req.body
  const query = `INSERT INTO categorie (nome, costo_max, macro_area, note) VALUES (?, ?, ?, ?)`

  db.run(query, [nome, costo_max, macro_area, note], function (err) {
    if (err) {
      res.status(500).json({ error: 'Errore nell\'inserimento' })
    } else {
      res.status(201).json({ id: this.lastID })
    }
  })
})

// ✅ PUT aggiornamento costo effettivo
app.put('/api/categorie/:id/effettivo', (req, res) => {
  const id = req.params.id
  const { costo_effettivo } = req.body
  const query = `UPDATE categorie SET costo_effettivo = ? WHERE id = ?`

  db.run(query, [costo_effettivo, id], function (err) {
    if (err) {
      res.status(500).json({ error: 'Errore aggiornamento effettivo' })
    } else {
      res.json({ message: 'Costo effettivo aggiornato' })
    }
  })
})

/* ---------- AVVIO SERVER ---------- */

app.listen(PORT, () => {
  console.log(`🚀 Server in ascolto su http://localhost:${PORT}`)
})
