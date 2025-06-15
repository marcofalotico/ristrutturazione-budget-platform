import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { aggiornaEffettivoAPI } from '../redux/budgetSlice'
import { Container, Form, Button, Alert } from 'react-bootstrap'

const InserisciSpesa = () => {
  const dispatch = useDispatch()
  const categorie = useSelector(state => state.budget.categorie)
  const [formData, setFormData] = useState({ categoria: '', effettivo: '' })

  // ✅ Stato per mostrare il messaggio di conferma
  const [successo, setSuccesso] = useState(false)

  const nonCompletate = categorie.filter(c => c.costo_effettivo === null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch(aggiornaEffettivoAPI(
      parseInt(formData.categoria),
      parseFloat(formData.effettivo)
    ))

    setFormData({ categoria: '', effettivo: '' })

    // ✅ Mostra il messaggio di successo per 3 secondi
    setSuccesso(true)
    setTimeout(() => setSuccesso(false), 3000)
  }

  return (
    <Container className="mt-5">
      <h2>Inserisci Spesa Effettiva</h2>

      {/* ✅ Messaggio di conferma */}
      {successo && (
        <Alert variant="success" className="text-center">
          ✅ Spesa salvata con successo!
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Select name="categoria" value={formData.categoria} onChange={handleChange} required>
            <option value="">-- Seleziona --</option>
            {nonCompletate.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Costo Effettivo (€)</Form.Label>
          <Form.Control
            type="number"
            name="effettivo"
            value={formData.effettivo}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit">Salva Spesa</Button>
      </Form>
    </Container>
  )
}

export default InserisciSpesa
