import { useSelector } from 'react-redux';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Grafici = () => {
  const categorie = useSelector((state) => state.budget.categorie);

  const [showPieModal, setShowPieModal] = useState(false);
  const [showBarModal, setShowBarModal] = useState(false);

  // ✅ Tipo di grafico a torta selezionato
  const [tipoPie, setTipoPie] = useState('preventivo');

  // ✅ Modalità per il bar chart: top N o tutte
  const [mostraTop, setMostraTop] = useState(true);

  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

  // ============================================================
  // 1) Aggregazione pie: preventivo / effettivo per macro area
  // ============================================================
  const macroPrevMap = {};
  const macroEffMap = {};

  categorie.forEach((c) => {
    const key = c.macro_area || 'Altro';

    const preventivo = typeof c.costo_max === 'number' ? c.costo_max : 0;
    const effettivo = typeof c.costo_effettivo === 'number' ? c.costo_effettivo : 0;

    macroPrevMap[key] = (macroPrevMap[key] || 0) + preventivo;
    macroEffMap[key] = (macroEffMap[key] || 0) + effettivo;
  });

  const generatePalette = (count) => {
    if (count <= 0) return [];
    return Array.from({ length: count }, (_, i) => {
      const hue = Math.round((360 * i) / count);
      return `hsl(${hue}, 70%, 50%)`;
    });
  };

  const buildPieData = (map, datasetLabel) => {
    const entries = Object.entries(map).filter(([, value]) => value > 0);

    const labels = entries.map(([label]) => label);
    const values = entries.map(([, value]) => value);
    const colors = generatePalette(labels.length);

    return {
      labels,
      datasets: [
        {
          label: datasetLabel,
          data: values,
          backgroundColor: colors
        }
      ]
    };
  };

  const pieData =
    tipoPie === 'preventivo'
      ? buildPieData(macroPrevMap, 'Preventivo per Macro Area (€)')
      : buildPieData(macroEffMap, 'Spesa Effettiva per Macro Area (€)');

  const pieTitle =
    tipoPie === 'preventivo'
      ? 'Distribuzione PREVENTIVI per Macro Area'
      : 'Distribuzione SPESE EFFETTIVE per Macro Area';

  const hasPieData = pieData.labels.length > 0;

  // ============================================================
  // 2) Dati per BAR chart: Top 15 vs tutte le categorie
  // ============================================================

  // 🔹 Ordiniamo le categorie per valore massimo fra preventivo/effettivo
  const categorieOrdinate = [...categorie].sort((a, b) => {
    const maxA = Math.max(a.costo_max || 0, a.costo_effettivo || 0);
    const maxB = Math.max(b.costo_max || 0, b.costo_effettivo || 0);
    return maxB - maxA;
  });

  const TOP_N = 15;

  // 🔹 Scegliamo il sottoinsieme da mostrare nel grafico
  const categoriePerGrafico = mostraTop
    ? categorieOrdinate.slice(0, TOP_N)
    : categorieOrdinate;

  // 🔹 Helper per accorciare le label sull'asse X
  const shorten = (str) => (str.length > 20 ? str.slice(0, 17) + '…' : str);

  const valoriPreventivo = categoriePerGrafico.map((c) =>
    typeof c.costo_max === 'number' ? c.costo_max : 0
  );
  const valoriEffettivo = categoriePerGrafico.map((c) =>
    typeof c.costo_effettivo === 'number' ? c.costo_effettivo : 0
  );

  const barData = {
    labels: categoriePerGrafico.map((c) => shorten(c.nome)),
    datasets: [
      {
        label: 'Preventivo (€)',
        data: valoriPreventivo,
        backgroundColor: 'rgba(0, 123, 255, 0.6)'
      },
      {
        label: 'Spesa Effettiva (€)',
        data: valoriEffettivo,
        backgroundColor: 'rgba(40, 167, 69, 0.6)'
      }
    ]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          // Titolo: nome completo della categoria
          title: (items) => {
            const index = items[0].dataIndex;
            return categoriePerGrafico[index].nome;
          },
          // Label: usa il valore "vero" formattato in €
          label: (ctx) => {
            const index = ctx.dataIndex;
            const isPrev = ctx.datasetIndex === 0;
            const valore = isPrev ? valoriPreventivo[index] : valoriEffettivo[index];
            return `${ctx.dataset.label}: € ${valore.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `€ ${value.toLocaleString()}`
        }
      },
      x: {
        ticks: {
          maxRotation: 60,
          minRotation: 45
        }
      }
    }
  };

  // ============================================================
  // 3) Download PNG / PDF
  // ============================================================
  const downloadChartAsPNG = (chartRef, fileName) => {
    if (!chartRef.current) return;
    const chartInstance = chartRef.current;
    const base64 = chartInstance.toBase64Image();
    const link = document.createElement('a');
    link.href = base64;
    link.download = fileName;
    link.click();
  };

  const downloadChartAsPDF = async (elementId, fileName) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save(fileName);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Analisi Grafica Ristrutturazione</h2>

      <Row className="gy-4">
        {/* ✅ PIE chart */}
        <Col md={6}>
          <Card className="shadow-sm p-3">
            <h5 className="text-center mb-3">{pieTitle}</h5>

            <div className="d-flex justify-content-center mb-3">
              <Button
                size="sm"
                variant={tipoPie === 'preventivo' ? 'primary' : 'outline-primary'}
                className="me-2"
                onClick={() => setTipoPie('preventivo')}
              >
                Preventivo
              </Button>
              <Button
                size="sm"
                variant={tipoPie === 'effettivo' ? 'primary' : 'outline-primary'}
                onClick={() => setTipoPie('effettivo')}
              >
                Effettivo
              </Button>
            </div>

            <div
              style={{ cursor: hasPieData ? 'pointer' : 'default' }}
              onClick={() => hasPieData && setShowPieModal(true)}
            >
              {hasPieData ? (
                <Pie data={pieData} />
              ) : (
                <p className="text-center text-muted my-5">
                  Nessuna macro area con{' '}
                  {tipoPie === 'preventivo'
                    ? 'costi preventivati'
                    : 'spese effettive'}
                  .
                </p>
              )}
            </div>

            <p className="text-center small text-muted mt-2">
              {hasPieData
                ? 'Clicca sul grafico per ingrandire'
                : 'Inserisci almeno un valore per vedere il grafico'}
            </p>
          </Card>
        </Col>

        {/* ✅ BAR chart */}
        <Col md={6}>
          <Card className="shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="text-center mb-0 flex-grow-1">
                Preventivo vs Spesa Effettiva
              </h5>
            </div>

            {/* Toggle Top 15 / Tutte */}
            <div className="d-flex justify-content-center mb-3">
              <Button
                size="sm"
                variant={mostraTop ? 'primary' : 'outline-primary'}
                className="me-2"
                onClick={() => setMostraTop(true)}
              >
                Top {TOP_N}
              </Button>
              <Button
                size="sm"
                variant={!mostraTop ? 'primary' : 'outline-primary'}
                onClick={() => setMostraTop(false)}
              >
                Mostra tutte
              </Button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <div
                style={{ minWidth: '600px', cursor: 'pointer' }}
                onClick={() => setShowBarModal(true)}
              >
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
      <Modal
        show={showPieModal}
        onHide={() => setShowPieModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {tipoPie === 'preventivo'
              ? 'Grafico Torta - Preventivo per Macro Area'
              : 'Grafico Torta - Spesa Effettiva per Macro Area'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body id="grafico-pie-container">
          {hasPieData ? (
            <Pie ref={pieChartRef} data={pieData} />
          ) : (
            <p className="text-center text-muted my-5">
              Nessuna macro area con{' '}
              {tipoPie === 'preventivo'
                ? 'costi preventivati'
                : 'spese effettive'}
              .
            </p>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <div>
            {hasPieData && (
              <>
                <Button
                  variant="outline-primary"
                  className="me-2"
                  onClick={() =>
                    downloadChartAsPNG(
                      pieChartRef,
                      tipoPie === 'preventivo'
                        ? 'grafico_torta_preventivo.png'
                        : 'grafico_torta_effettivo.png'
                    )
                  }
                >
                  📥 Scarica PNG
                </Button>
                <Button
                  variant="outline-success"
                  onClick={() =>
                    downloadChartAsPDF(
                      'grafico-pie-container',
                      tipoPie === 'preventivo'
                        ? 'grafico_torta_preventivo.pdf'
                        : 'grafico_torta_effettivo.pdf'
                    )
                  }
                >
                  📄 Scarica PDF
                </Button>
              </>
            )}
          </div>
          <Button variant="secondary" onClick={() => setShowPieModal(false)}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ MODAL BAR */}
      <Modal
        show={showBarModal}
        onHide={() => setShowBarModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Grafico Barre Ingrandito</Modal.Title>
        </Modal.Header>
        <Modal.Body id="grafico-bar-container">
          <Bar ref={barChartRef} data={barData} options={barOptions} />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <div>
            <Button
              variant="outline-primary"
              className="me-2"
              onClick={() =>
                downloadChartAsPNG(barChartRef, 'grafico_barre.png')
              }
            >
              📥 Scarica PNG
            </Button>
            <Button
              variant="outline-success"
              onClick={() =>
                downloadChartAsPDF('grafico-bar-container', 'grafico_barre.pdf')
              }
            >
              📄 Scarica PDF
            </Button>
          </div>
          <Button variant="secondary" onClick={() => setShowBarModal(false)}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Grafici;
