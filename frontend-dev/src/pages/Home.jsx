import { useDispatch, useSelector } from 'react-redux'
import { fetchCategorieAPI } from '../redux/budgetSlice'
import { useEffect } from 'react'
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap'

const Home = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCategorieAPI())
  }, [dispatch])

  const {
    categorie,
    totaleStimato,
    totaleEffettivo,
    scostamento,
    completamento
  } = useSelector((state) => state.budget)

  // ✅ Raggruppa per macro area e calcola scostamento
  const macroAree = {};
  categorie.forEach((cat) => {
    const area = cat.macro_area || 'Altro';
    if (!macroAree[area]) {
      macroAree[area] = { preventivo: 0, effettivo: 0 };
    }
    macroAree[area].preventivo += cat.costo_max || 0;
    macroAree[area].effettivo += cat.costo_effettivo || 0;
  });

  // ✅ Se costo_effettivo è null/undefined/0, consideriamo la categoria "da acquistare"
  const elementiDaAcquistare = categorie.filter((cat) => {
    return !cat.costo_effettivo || cat.costo_effettivo === 0;
  });

  // 💰 Totale previsto dei prodotti ancora da acquistare
  const totaleDaAcquistare = elementiDaAcquistare.reduce(
    (sum, cat) => sum + (cat.costo_max || 0),
    0
  );


  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-start align-items-center pt-5"
      style={{ minHeight: 'calc(100vh - 80px)' }}
    >
      <h1 className="text-center mb-4">Dashboard</h1>

      <Row className="gy-4 justify-content-center w-100 px-3">

        {/* ✅ Card 1: Totali */}
        <Col xs={12} md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              {/* <Card.Title className="mb-3 text-center fw-bold">Totali Ristrutturazione</Card.Title> */}

              <Row>
                <Col md={4} className="text-center mb-3 mb-md-0">
                  <div className="text-secondary">Budget Previsto</div>
                  <h4 className="text-primary">€ {totaleStimato.toLocaleString()}</h4>
                </Col>
                <Col md={4} className="text-center mb-3 mb-md-0">
                  <div className="text-secondary">Spesa Effettiva</div>
                  <h4 className="text-success">€ {totaleEffettivo.toLocaleString()}</h4>
                </Col>
                <Col md={4} className="text-center">
                  <div className="text-secondary">Scostamento</div>
                  <h4 className={scostamento <= 0 ? 'text-success' : 'text-danger'}>
                    {scostamento > 0 ? '+' : ''}€ {scostamento.toLocaleString()}
                  </h4>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* ✅ Card 2: Stato Budget + Macro Aree */}
        <Col xs={12} md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3 text-center fw-bold">📊 Stato Budget</Card.Title>

              {/* ✅ Totale */}
              <div className="text-center mb-4">
                {scostamento <= 0 ? (
                  <p className="text-success fw-bold">
                    👍 Sei dentro al budget di: € {Math.abs(scostamento).toLocaleString()}
                  </p>
                ) : (
                  <p className="text-danger fw-bold">
                    ⚠️ Stai sforando il budget di: € {scostamento.toLocaleString()}
                  </p>
                )}
              </div>

              {/* ✅ Stato per macro area */}
              <Row>
                {Object.entries(macroAree).map(([area, valori]) => {
                  const scostamentoArea = valori.effettivo - valori.preventivo
                  const inBudget = scostamentoArea <= 0
                  const colore = inBudget ? 'text-success' : 'text-danger'
                  const simbolo = inBudget ? '✅' : '⚠️'

                  return (
                    <Col key={area} xs={12} sm={6} className="mb-2">
                      <div className={`fw-semibold ${colore}`}>
                        {simbolo} <strong>{area}</strong>:{' '}
                        {inBudget
                          ? `sei dentro al budget di € ${Math.abs(scostamentoArea).toLocaleString()}`
                          : `hai sforato di € ${scostamentoArea.toLocaleString()}`}
                          <br />
                          {"Su un totale di € "}{valori.preventivo}
                      </div>
                    </Col>
                  )
                })}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* ✅ Card 3: Completamento + elementi da acquistare */}
        <Col xs={12} md={10} lg={8}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              {/* Titolo della sezione completamento */}
              <Card.Title className="text-secondary mb-2">Completamento</Card.Title>

              {/* ✅ Barra di avanzamento generale */}
              {/* In React il valore "now" viene da Redux: quando lo store cambia,
                  il componente viene ri-renderizzato mostrando la percentuale aggiornata */}
              <ProgressBar
                now={completamento}
                label={`${completamento}%`}
                variant={completamento < 100 ? 'info' : 'success'}
              />

              <hr className="my-4" />

              {elementiDaAcquistare.length > 0 ? (
                <>
                  {/* Sottotitolo se ci sono elementi da acquistare */}
                  <h6 className="text-secondary mb-3">
                    Elementi ancora da acquistare ({elementiDaAcquistare.length})
                  </h6>

                  {/* Lista senza puntini, allineata a sinistra per leggibilità */}
                  <ul className="list-unstyled mb-0 text-start">
                    {elementiDaAcquistare.map((cat) => (
                      <li key={cat.id} className="mb-1">
                        {/* In React è importante usare una key stabile (qui l'id del record) */}
                        • <strong>{cat.nome}</strong>
                        {cat.macro_area && ` – ${cat.macro_area}`}
                        {typeof cat.costo_max === 'number' &&
                          ` (budget previsto: € ${cat.costo_max.toLocaleString()})`}
                      </li>
                    ))}
                    <p className="text-danger fw-bold mb-3">
                      Totale rimanente: € {totaleDaAcquistare.toLocaleString()}
                    </p>
                  </ul>
                </>
              ) : (
                // Messaggio positivo quando tutte le categorie hanno un costo effettivo > 0
                <p className="mt-3 mb-0 text-success">
                  Hai inserito un costo effettivo per tutte le categorie 🎉
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </Container>
  )
}

export default Home
