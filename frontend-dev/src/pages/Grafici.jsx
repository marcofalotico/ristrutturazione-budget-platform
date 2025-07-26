import { useSelector } from 'react-redux'
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap'
import { useRef, useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

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

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const Grafici = () => {
  const categorie = useSelector((state) => state.budget.categorie)

  const [showPieModal, setShowPieModal] = useState(false)
  const [showBarModal, setShowBarModal] = useState(false)

  // ✅ Ref ai grafici
  const pieChartRef = useRef(null)
  const barChartRef = useRef(null)

  // ✅ Aggregazione per grafico a torta
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
  }

  // ✅ Funzioni download PNG
  const downloadChartAsPNG = (chartRef, fileName) => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const base64 = chart.toBase64Image();
      const link = document.createElement('a');
      link.href = base64;
      link.download = fileName;
      link.click();
    }
  }

  // ✅ Funzioni download PDF
  const downloadChartAsPDF = async (elementId, fileName) => {
    const element = document.getElementById(elementId);
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save(fileName);
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Analisi Grafica Ristrutturazione</h2>

      <Row className="gy-4">
        {/* ✅ PIE chart */}
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

        {/* ✅ BAR chart */}
        <Col md={6}>
          <Card className="shadow-sm p-3">
            <h5 className="text-center">Preventivo vs Spesa Effettiva</h5>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: '600px', cursor: 'pointer' }} onClick={() => setShowBarModal(true)}>
                <Bar data={barData} options={barOptions} />
              </div>
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
        <Modal.Body id="grafico-pie-container">
          <Pie ref={pieChartRef} data={pieData} />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <div>
            <Button variant="outline-primary" onClick={() => downloadChartAsPNG(pieChartRef, 'grafico_torta.png')} className="me-2">
              📥 Scarica PNG
            </Button>
            <Button variant="outline-success" onClick={() => downloadChartAsPDF('grafico-pie-container', 'grafico_torta.pdf')}>
              📄 Scarica PDF
            </Button>
          </div>
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
        <Modal.Body id="grafico-bar-container">
          <Bar ref={barChartRef} data={barData} options={barOptions} />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <div>
            <Button variant="outline-primary" onClick={() => downloadChartAsPNG(barChartRef, 'grafico_barre.png')} className="me-2">
              📥 Scarica PNG
            </Button>
            <Button variant="outline-success" onClick={() => downloadChartAsPDF('grafico-bar-container', 'grafico_barre.pdf')}>
              📄 Scarica PDF
            </Button>
          </div>
          <Button variant="secondary" onClick={() => setShowBarModal(false)}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Grafici
