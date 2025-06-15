import { useSelector } from 'react-redux'
import { Container, Row, Col, Card } from 'react-bootstrap'

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

// ✅ Registriamo i componenti di Chart.js
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const Grafici = () => {
  const categorie = useSelector((state) => state.budget.categorie)

  // ✅ Aggrego costo_max per macro_area (per il grafico a torta)
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

  // ✅ Grafico a barre: confronto costo_max vs costo_effettivo per ogni categoria
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

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Analisi Grafica Ristrutturazione</h2>

      <Row className="gy-4">
        <Col md={6}>
          <Card className="shadow-sm p-3">
            <h5 className="text-center">Distribuzione Preventivi per Macro Area</h5>
            <Pie data={pieData} />
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm p-3">
            <h5 className="text-center">Preventivo vs Spesa Effettiva</h5>
            <Bar data={barData} options={barOptions} />
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Grafici
