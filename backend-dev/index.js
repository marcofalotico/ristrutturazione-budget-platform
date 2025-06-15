const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Rotta di test
app.get('/', (req, res) => {
  res.send('Backend funzionante ✅')
})

app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`)
})