// ✅ src/pages/ElencoCategorie.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../SupabaseClient';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import ModaleModificaCategoria from '../components/ModaleModificaCategoria';
import BarraRicerca from '../components/BarraRicerca';

const ElencoCategorie = () => {
  const [categorie, setCategorie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModale, setShowModale] = useState(false);
  const [categoriaSelezionata, setCategoriaSelezionata] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [messaggioSuccesso, setMessaggioSuccesso] = useState('');

  // ✅ Nuovo stato per filtro macro area
  const [macroAreaAttiva, setMacroAreaAttiva] = useState('Tutte');

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

  // ✅ Macro aree uniche per i bottoni di filtro
  const macroAreeUniche = [
    'Tutte',
    ...Array.from(new Set(categorie.map(cat => cat.macro_area || 'Altro')))
  ];

  // ✅ Filtro combinato: testo + macro area attiva
  const categorieFiltrate = categorie.filter((cat) => {
    const filtroLower = filtro.toLowerCase();
    const matchTesto =
      cat.nome?.toLowerCase().includes(filtroLower) ||
      cat.macro_area?.toLowerCase().includes(filtroLower) ||
      cat.note?.toLowerCase().includes(filtroLower);

    const matchMacroArea =
      macroAreaAttiva === 'Tutte' || (cat.macro_area || 'Altro') === macroAreaAttiva;

    return matchTesto && matchMacroArea;
  });

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Caricamento categorie...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      {/* ✅ Bottoni di filtro per macro area */}
      <div className="mb-3 d-flex flex-wrap gap-2">
        {macroAreeUniche.map((area) => (
          <Button
            key={area}
            variant={area === macroAreaAttiva ? 'primary' : 'outline-secondary'}
            size="sm"
            onClick={() => setMacroAreaAttiva(area)}
          >
            {area}
          </Button>
        ))}
      </div>

      <h2>Elenco delle Categorie</h2>

      {messaggioSuccesso && <Alert variant="success">{messaggioSuccesso}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

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

      {categoriaSelezionata && (
        <ModaleModificaCategoria
          show={showModale}
          onHide={() => setShowModale(false)}
          categoria={categoriaSelezionata}
          onSalva={handleSalvaModifica}
        />
      )}
    </Container>
  );
};

export default ElencoCategorie;
