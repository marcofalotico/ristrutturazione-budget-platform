// ✅ Home.jsx
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategorieAPI } from '../redux/budgetSlice'
import { useEffect } from 'react'

// ✅ Componenti Bootstrap usati nella dashboard
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap'

const Home = () => {
  const dispatch = useDispatch()

  // ✅ Carica categorie da backend quando la pagina monta
  useEffect(() => {
    dispatch(fetchCategorieAPI())
  }, [dispatch])

  // ✅ Leggi i totali dal Redux Store
  const {
    totaleStimato,
    totaleEffettivo,
    scostamento,
    completamento
  } = useSelector((state) => state.budget)

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-start align-items-center pt-5"
      style={{ minHeight: 'calc(100vh - 80px)' }} // altezza piena meno navbar
    >
      <h1 className="text-center mb-4">Dashboard Ristrutturazione</h1>

      <Row className="gy-4 justify-content-center">
        <Col md={6} lg={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title className="text-secondary">Budget Previsto</Card.Title>
              <h3 className="text-primary">€ {totaleStimato.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title className="text-secondary">Spesa Effettiva</Card.Title>
              <h3 className="text-success">€ {totaleEffettivo.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title className="text-secondary">Scostamento</Card.Title>
              <h3 className={scostamento < 0 ? 'text-success' : 'text-danger'}>
                {scostamento > 0 ? '+' : ''}€ {scostamento.toLocaleString()}
              </h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={6}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title className="text-secondary">Stato Budget</Card.Title>
              {scostamento <= 0 ? (
                <p className="text-success fw-bold">
                  👍 Sei dentro al budget di: € {Math.abs(scostamento).toLocaleString()}
                </p>
              ) : (
                <p className="text-danger fw-bold">
                  ⚠️ Stai sforando il budget di: € {scostamento.toLocaleString()}
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title className="text-secondary">Completamento</Card.Title>
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
