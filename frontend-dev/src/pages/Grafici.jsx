import { useSelector } from 'react-redux'
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap'
import { useState } from 'react'

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

// ✅ Registra i componenti di Chart.js
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const Grafici = () => {
  const categorie = useSelector((state) => state.budget.categorie)

  // ✅ Stati per Modals
  const [showPieModal, setShowPieModal] = useState(false)
  const [showBarModal, setShowBarModal] = useState(false)

  // ✅ Pie Chart: aggrego costo_max per macro_area
  const macroAreaMap = {}
  categorie.forEach((c) => {
    macroAreaMap[c.macro_area] = (macroAreaMap[c.macro_area] || 0) + c.costo_max
  })

  const macroLabels = Object.keys(macroAreaMap)
  const macroValues = Object.values(macroAreaMap)

  const pieData = {
    labels: macroLabels,
    datasets: [
      {
        label: 'Preventivo per Macro Area (€)',
        data: macroValues,
        backgroundColor: [
          '#007bff',
          '#ffc107',
          '#28a745',
          '#dc3545',
          '#17a2b8',
          '#6610f2'
        ]
      }
    ]
  }

  // ✅ Bar Chart: confronto preventivo vs effettivo
  const barData = {
    labels: categorie.map(c => c.nome),
    datasets: [
      {
        label: 'Preventivo (€)',
        data: categorie.map(c => c.costo_max),
        backgroundColor: 'rgba(0, 123, 255, 0.6)'
      },
      {
        label: 'Spesa Effettiva (€)',
        data: categorie.map(c => c.costo_effettivo || 0),
        backgroundColor: 'rgba(40, 167, 69, 0.6)'
      }
    ]
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
    // ❌ Nessuna scala Y dinamica qui!
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Analisi Grafica Ristrutturazione</h2>

      <Row className="gy-4">
        {/* ✅ PIE cliccabile */}
        <Col md={6}>
          <Card className="shadow-sm p-3">
            <h5 className="text-center">Distribuzione Preventivi per Macro Area</h5>
            <div style={{ cursor: 'pointer' }} onClick={() => setShowPieModal(true)}>
              <Pie data={pieData} />
            </div>
            <p className="text-center small text-muted mt-2">
              Clicca sul grafico per ingrandire
            </p>
          </Card>
        </Col>

        {/* ✅ BAR cliccabile */}
        <Col md={6}>
          <Card className="shadow-sm p-3">
            <h5 className="text-center">Preventivo vs Spesa Effettiva</h5>
            <div style={{ cursor: 'pointer' }} onClick={() => setShowBarModal(true)}>
              <Bar data={barData} options={barOptions} />
            </div>
            <p className="text-center small text-muted mt-2">
              Clicca sul grafico per ingrandire
            </p>
          </Card>
        </Col>
      </Row>

      {/* ✅ MODAL PIE */}
      <Modal show={showPieModal} onHide={() => setShowPieModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Grafico Torta Ingrandito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Pie data={pieData} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPieModal(false)}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ MODAL BAR */}
      <Modal show={showBarModal} onHide={() => setShowBarModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Grafico Barre Ingrandito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Bar data={barData} options={barOptions} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBarModal(false)}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Grafici
