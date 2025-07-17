// ✅ src/pages/ElencoCategorie.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../SupabaseClient';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import ModaleModificaCategoria from '../components/ModaleModificaCategoria';
import BarraRicerca from '../components/BarraRicerca';

const ElencoCategorie = () => {
    // ✅ Stato locale: array di categorie caricate da Supabase
    const [categorie, setCategorie] = useState([]);
    // ✅ Stato: flag per caricamento
  const [loading, setLoading] = useState(true);
    // ✅ Stato: errori nel caricamento
  const [error, setError] = useState('');
    // ✅ Stato per la modale di modifica
  const [showModale, setShowModale] = useState(false);
  const [categoriaSelezionata, setCategoriaSelezionata] = useState(null);
    // ✅ Stato per barra di ricerca
  const [filtro, setFiltro] = useState('');
  // ✅ Stato per messaggi di successo
  const [messaggioSuccesso, setMessaggioSuccesso] = useState('');

  // ✅ Carica categorie da Supabase
  const fetchCategorie = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categorie')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error(error);
      setError('Errore nel caricamento categorie');
    } else {
      setCategorie(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategorie();
  }, []);

  // ✅ Elimina categoria da Supabase
  const handleElimina = async (id) => {
    const conferma = window.confirm("Sei sicuro di voler eliminare questa categoria?");
    if (!conferma) return;

    const { error } = await supabase
      .from('categorie')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Errore durante eliminazione:', error);
      alert('Errore durante l\'eliminazione');
    } else {
      setCategorie(prev => prev.filter(cat => cat.id !== id));
      setMessaggioSuccesso('✅ Categoria eliminata con successo!');
      setTimeout(() => setMessaggioSuccesso(''), 3000);
    }
  };

  // ✅ Salva modifica categoria e aggiorna riga corrispondente
  const handleSalvaModifica = (categoriaModificata) => {
    setCategorie(prev =>
      prev.map(cat => (cat.id === categoriaModificata.id ? categoriaModificata : cat))
    );
    setMessaggioSuccesso('✅ Modifica avvenuta con successo!');
    setTimeout(() => setMessaggioSuccesso(''), 3000);
    setShowModale(false);
  };

  const handleModifica = (categoria) => {
    setCategoriaSelezionata(categoria);
    setShowModale(true);
  };

// ✅ Spinner durante il caricamento
  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Caricamento categorie...</p>
      </Container>
    );
  }

  // ✅ Applica filtro alla lista (case-insensitive)
  const categorieFiltrate = categorie.filter((cat) => {
    const filtroLower = filtro.toLowerCase();
    return (
      cat.nome?.toLowerCase().includes(filtroLower) ||
      cat.macro_area?.toLowerCase().includes(filtroLower) ||
      cat.note?.toLowerCase().includes(filtroLower)
    );
  });

  return (
    <Container className="mt-5">
      <h2>Elenco delle Categorie</h2>

      {/* ✅ Messaggio di successo */}
      {messaggioSuccesso && <Alert variant="success">{messaggioSuccesso}</Alert>}

      {/* ✅ Messaggio di errore */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* ✅ Barra ricerca */}
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
              <td data-label="Preventivo (€)">{cat.costo_max ?? 'N/D'}</td>
              <td data-label="Effettivo (€)">{cat.costo_effettivo ?? '0'}</td>
              <td data-label="Macro Area">{cat.macro_area ?? 'N/D'}</td>
              <td data-label="Note">{cat.note ?? 'N/D'}</td>
              <td data-label="Azioni">
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleModifica(cat)}
                >
                  Modifica
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleElimina(cat.id)}
                >
                  Elimina
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* ✅ Modale visibile solo se categoria selezionata */}
      {categoriaSelezionata && (
        <ModaleModificaCategoria
          show={showModale}
          onHide={() => setShowModale(false)}
          categoria={categoriaSelezionata}
          onSalva={handleSalvaModifica} // ✅ callback che aggiorna la lista
        />
      )}
    </Container>
  );
};

export default ElencoCategorie;
