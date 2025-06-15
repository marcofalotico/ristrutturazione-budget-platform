// ✅ ElencoCategorie.jsx
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Container, Table, Button } from 'react-bootstrap'
import ModaleModificaCategoria from '../components/ModaleModificaCategoria'

const ElencoCategorie = () => {
  const categorie = useSelector(state => state.budget.categorie)

  // ✅ Stato per aprire la modale
  const [showModale, setShowModale] = useState(false)

  // ✅ Stato per tenere traccia della categoria selezionata da modificare
  const [categoriaSelezionata, setCategoriaSelezionata] = useState(null)

  // ✅ Quando clicco su "Modifica", salvo la categoria corrente e apro la modale
  const handleModifica = (categoria) => {
    setCategoriaSelezionata(categoria)
    setShowModale(true)
  }

  return (
    <Container className="mt-5">
      <h2>Elenco delle Categorie</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preventivo (€)</th>
            <th>Effettivo (€)</th>
            <th>Macro Area</th>
            <th>Note</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {categorie.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.nome}</td>
              <td>{cat.costo_max}</td>
              <td>{cat.costo_effettivo ?? ''}</td>
              <td>{cat.macro_area ?? ''}</td>
              <td>{cat.note ?? ''}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleModifica(cat)}
                >
                  Modifica
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* ✅ Includiamo la modale e la apriamo solo se una categoria è selezionata */}
      {categoriaSelezionata && (
        <ModaleModificaCategoria
          show={showModale}
          onHide={() => setShowModale(false)}
          categoria={categoriaSelezionata}
        />
      )}
    </Container>
  )
}

export default ElencoCategorie
