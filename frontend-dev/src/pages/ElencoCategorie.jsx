// ✅ ElencoCategorie.jsx
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Container, Table, Button } from 'react-bootstrap'
import ModaleModificaCategoria from '../components/ModaleModificaCategoria'
import BarraRicerca from '../components/BarraRicerca' // ✅ importa la barra

const ElencoCategorie = () => {
  const categorie = useSelector(state => state.budget.categorie)

  // ✅ Stato per aprire la modale
  const [showModale, setShowModale] = useState(false)

  // ✅ Stato per tenere traccia della categoria selezionata da modificare
  const [categoriaSelezionata, setCategoriaSelezionata] = useState(null)

  // ✅ Stato per la barra di ricerca
  const [filtro, setFiltro] = useState('')

  // ✅ Quando clicco su "Modifica", salvo la categoria corrente e apro la modale
  const handleModifica = (categoria) => {
    setCategoriaSelezionata(categoria)
    setShowModale(true)
  }

  // ✅ Filtro le categorie in base a quello che scrivo nella barra di ricerca
  const categorieFiltrate = categorie.filter((cat) => {
    const filtroLower = filtro.toLowerCase()
    return (
      cat.nome?.toLowerCase().includes(filtroLower) ||
      cat.macro_area?.toLowerCase().includes(filtroLower) ||
      cat.note?.toLowerCase().includes(filtroLower)
    )
  })

  return (
    <Container className="mt-5">
      <h2>Elenco delle Categorie</h2>

      {/* ✅ Barra di ricerca come componente */}
      <BarraRicerca filtro={filtro} setFiltro={setFiltro} />

      <Table striped bordered hover responsive>
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
          {categorieFiltrate.map((cat) => (
            <tr key={cat.id}>
              <td data-label="Nome">{cat.nome}</td>
              <td data-label="Preventivo (€)">{cat.costo_max}</td>
              <td data-label="Effettivo (€)">{cat.costo_effettivo ?? ''}</td>
              <td data-label="Macro Area">{cat.macro_area ?? ''}</td>
              <td data-label="Note">{cat.note ?? ''}</td>
              <td data-label="Azioni">
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

      {/* ✅ Modale visibile solo se c'è una categoria selezionata */}
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
