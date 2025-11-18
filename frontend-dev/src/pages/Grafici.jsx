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

  // ✅ NUOVO: tipo di grafico a torta selezionato ("preventivo" | "effettivo")
  const [tipoPie, setTipoPie] = useState('preventivo');

  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

  // ============================================================
  // 1) Aggregazione per macro area: preventivo ed effettivo separati
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

  // ✅ Generatore di palette dinamica (tanti colori ben distanziati)
  const generatePalette = (count) => {
    if (count <= 0) return [];
    return Array.from({ length: count }, (_, i) => {
      const hue = Math.round((360 * i) / count);
      return `hsl(${hue}, 70%, 50%)`;
    });
  };

  // ✅ Costruisce i dati per il pie, filtrando le macro aree con valore 0
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

  // ✅ Scegliamo quali dati usare in base al tipo di grafico selezionato
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
  // 2) Dati per grafico a barre (per categoria)
  // ============================================================
  const barData = {
    labels: categorie.map((c) => c.nome),
    datasets: [
      {
        label: 'Preventivo (€)',
        data: categorie.map((c) =>
          typeof c.costo_max === 'number' ? c.costo_max : 0
        ),
        backgroundColor: 'rgba(0, 123, 255, 0.6)'
      },
      {
        label: 'Spesa Effettiva (€)',
        data: categorie.map((c) =>
          typeof c.costo_effettivo === 'number' ? c.costo_effettivo : 0
        ),
        backgroundColor: 'rgba(40, 167, 69, 0.6)'
      }
    ]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  // ============================================================
  // 3) Download PNG
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

  // ============================================================
  // 4) Download PDF
  // ============================================================
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

            {/* 🔀 Toggle Preventivo / Effettivo */}
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
                  Nessuna macro area con {tipoPie === 'preventivo'
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
            <h5 className="text-center">Preventivo vs Spesa Effettiva</h5>
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
              Nessuna macro area con {tipoPie === 'preventivo'
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
