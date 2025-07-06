import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { aggiornaEffettivoAPI } from '../redux/budgetSlice'
import { Container, Form, Button, Alert } from 'react-bootstrap'
import Select from 'react-select'

const InserisciSpesa = () => {
  const dispatch = useDispatch()
  const categorie = useSelector(state => state.budget.categorie)

  const [formData, setFormData] = useState({ categoria: '', effettivo: '' })
  const [successo, setSuccesso] = useState(false)

  // Filtra categorie non completate
  const nonCompletate = categorie.filter(c => c.costo_effettivo === null)

  // Costruisci le options per react-select
  const options = nonCompletate.map(c => ({
    value: c.id,
    label: c.nome
  }))

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.categoria || !formData.effettivo) return

    dispatch(
      aggiornaEffettivoAPI(
        parseInt(formData.categoria),
        parseFloat(formData.effettivo)
      )
    )

    setFormData({ categoria: '', effettivo: '' })
    setSuccesso(true)
    setTimeout(() => setSuccesso(false), 3000)
  }

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <h2>Inserisci Spesa Effettiva</h2>

      {successo && (
        <Alert variant="success" className="text-center">
          ✅ Spesa salvata con successo!
        </Alert>
      )}

      {nonCompletate.length > 0 ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Categoria</Form.Label>
            <Select
              options={options}
              placeholder="-- Seleziona --"
              value={options.find(o => o.value === formData.categoria) || null}
              onChange={(selected) =>
                setFormData({
                  ...formData,
                  categoria: selected ? selected.value : ''
                })
              }
              isClearable
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Costo Effettivo (€)</Form.Label>
            <Form.Control
              type="number"
              name="effettivo"
              value={formData.effettivo}
              onChange={(e) =>
                setFormData({ ...formData, effettivo: e.target.value })
              }
              placeholder="Es: 1000"
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            Salva Spesa
          </Button>
        </Form>
      ) : (
        <Alert variant="info" className="mt-3">
          🎉 Tutte le categorie hanno già una spesa effettiva!
        </Alert>
      )}
    </Container>
  )
}

export default InserisciSpesa
