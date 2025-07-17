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
  const macroAree = {}
  categorie.forEach((cat) => {
    const area = cat.macro_area || 'Altro'
    if (!macroAree[area]) {
      macroAree[area] = { preventivo: 0, effettivo: 0 }
    }
    macroAree[area].preventivo += cat.costo_max || 0
    macroAree[area].effettivo += cat.costo_effettivo || 0
  })

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-start align-items-center pt-5"
      style={{ minHeight: 'calc(100vh - 80px)' }}
    >
      <h1 className="text-center mb-4">Dashboard Ristrutturazione</h1>

      <Row className="gy-4 justify-content-center w-100 px-3">

        {/* ✅ Card 1: Totali */}
        <Col xs={12} md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3 text-center fw-bold">Totali Ristrutturazione</Card.Title>

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
                      </div>
                    </Col>
                  )
                })}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* ✅ Card 3: Completamento */}
        <Col xs={12} md={10} lg={8}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <Card.Title className="text-secondary mb-2">Completamento</Card.Title>
              <ProgressBar
                now={completamento}
                label={`${completamento}%`}
                variant={completamento < 100 ? 'info' : 'success'}
              />
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </Container>
  )
}

export default Home
