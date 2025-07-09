// ✅ src/pages/ElencoCategorie.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../SupabaseClient'; // 👈 importa il client
import { Container, Table, Button, Spinner } from 'react-bootstrap';
import ModaleModificaCategoria from '../components/ModaleModificaCategoria';
import BarraRicerca from '../components/BarraRicerca';

const ElencoCategorie = () => {
  // ✅ Stato: categorie caricate da Supabase
  const [categorie, setCategorie] = useState([]);

  // ✅ Stato: caricamento
  const [loading, setLoading] = useState(true);

  // ✅ Stato: errori
  const [error, setError] = useState('');

  // ✅ Stato: modale di modifica
  const [showModale, setShowModale] = useState(false);
  const [categoriaSelezionata, setCategoriaSelezionata] = useState(null);

  // ✅ Stato: barra di ricerca
  const [filtro, setFiltro] = useState('');

  // ✅ Carica le categorie all'avvio
  useEffect(() => {
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

    fetchCategorie();
  }, []);

  // ✅ Mostra spinner se carica
  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Caricamento categorie...</p>
      </Container>
    );
  }

  // ✅ Filtro
  const categorieFiltrate = categorie.filter((cat) => {
    const filtroLower = filtro.toLowerCase();
    return (
      cat.nome?.toLowerCase().includes(filtroLower) ||
      cat.macro_area?.toLowerCase().includes(filtroLower) ||
      cat.note?.toLowerCase().includes(filtroLower)
    );
  });

  // ✅ Quando clicco Modifica
  const handleModifica = (categoria) => {
    setCategoriaSelezionata(categoria);
    setShowModale(true);
  };

  return (
    <Container className="mt-5">
      <h2>Elenco delle Categorie</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Barra di ricerca */}
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
              <td data-label="Nome">
                {cat.nome}
              </td>
              <td data-label="Preventivo (€)">
                {cat.costo_max ?? 'N/D'}
              </td>
              <td data-label="Effettivo (€)">
                {cat.costo_effettivo ?? '0'}
              </td>
              <td data-label="Macro Area">
                {cat.macro_area ?? 'N/D'}
              </td>
              <td data-label="Note">
                {cat.note ?? 'N/D'}
              </td>
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

      {/* Modale */}
      {categoriaSelezionata && (
        <ModaleModificaCategoria
          show={showModale}
          onHide={() => setShowModale(false)}
          categoria={categoriaSelezionata}
        />
      )}
    </Container>
  );
};

export default ElencoCategorie;
