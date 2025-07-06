import { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Pie } from 'react-chartjs-2'

const GraficoConModal = ({ pieData }) => {
  const [show, setShow] = useState(false)

  return (
    <>
      {/* Piccolo grafico cliccabile */}
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => setShow(true)}
      >
        <Pie data={pieData} />
      </div>

      {/* Modal con grafico ingrandito */}
      <Modal show={show} onHide={() => setShow(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Grafico Ingrandito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Pie data={pieData} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default GraficoConModal
