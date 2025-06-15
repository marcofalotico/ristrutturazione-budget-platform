import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { Container, Form, Button, Alert } from 'react-bootstrap'

// ✅ Nuova funzione API-based (non più azione locale)
import { aggiungiCategoriaAPI } from '../redux/budgetSlice'

const InserisciCategoria = () => {
  const dispatch = useDispatch()

  // Stato del form
  const [formData, setFormData] = useState({
    nome: '',
    stimato: '',
    macroArea: '',
    note: ''
  })

  // ✅ Stato per mostrare messaggio conferma
  const [successo, setSuccesso] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // ✅ VERSIONE BACKEND (POST su SQLite)
    dispatch(aggiungiCategoriaAPI({
      nome: formData.nome,
      costo_max: parseFloat(formData.stimato),
      macro_area: formData.macroArea,
      note: formData.note
    }))

    // ✅ VERSIONE MOCK (solo Redux locale) — ora commentata
    /*
    dispatch(addCategoria({
      nome: formData.nome,
      stimato: parseFloat(formData.stimato),
      effettivo: null,
      macroArea: formData.macroArea,
      note: formData.note
    }))
    */

    // Reset form + mostra conferma
    setFormData({ nome: '', stimato: '', macroArea: '', note: '' })
    setSuccesso(true)
    setTimeout(() => setSuccesso(false), 3000)
  }

  return (
    <Container className="mt-5">
      <h2>Inserisci Nuova Categoria</h2>

      {/* ✅ Messaggio conferma */}
      {successo && (
        <Alert variant="success" className="text-center">
          ✅ Preventivo aggiunto con successo!
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nome Categoria</Form.Label>
          <Form.Control
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Costo Previsto (€)</Form.Label>
          <Form.Control
            type="number"
            name="stimato"
            value={formData.stimato}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Macro Area</Form.Label>
          <Form.Control
            name="macroArea"
            value={formData.macroArea}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Note</Form.Label>
          <Form.Control
            name="note"
            value={formData.note}
            onChange={handleChange}
          />
        </Form.Group>

        <Button type="submit">Aggiungi Categoria</Button>
      </Form>
    </Container>
  )
}

export default InserisciCategoria
