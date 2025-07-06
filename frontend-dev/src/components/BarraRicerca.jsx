// ✅ BarraRicerca.jsx
import { Form } from 'react-bootstrap'

const BarraRicerca = ({ filtro, setFiltro }) => {
  const handleSubmit = (e) => {
    e.preventDefault() // ✅ blocca l'invio del form
  }

  return (
    <Form className="mb-3" onSubmit={handleSubmit}>
      <Form.Control
        type="text"
        placeholder="Cerca categoria..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
    </Form>
  )
}

export default BarraRicerca
