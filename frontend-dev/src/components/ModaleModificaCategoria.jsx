// ✅ ModaleModificaCategoria.jsx
import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { modificaCategoriaAPI } from '../redux/budgetSlice';

const ModaleModificaCategoria = ({ show, onHide, categoria }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    nome: '',
    costo_max: '',
    macro_area: '',
    note: ''
  });

  // ✅ Quando ricevo la categoria, inizializzo i dati del form
  useEffect(() => {
    if (categoria) {
      setFormData({
        nome: categoria.nome,
        costo_max: categoria.costo_max,
        macro_area: categoria.macro_area,
        note: categoria.note || ''
      });
    }
  }, [categoria]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(modificaCategoriaAPI({
      id: categoria.id,
      ...formData,
      costo_max: parseFloat(formData.costo_max)
    }));
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifica Categoria</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control name="nome" value={formData.nome} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Costo Previsto (€)</Form.Label>
            <Form.Control type="number" name="costo_max" value={formData.costo_max} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Macro Area</Form.Label>
            <Form.Control name="macro_area" value={formData.macro_area} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Note</Form.Label>
            <Form.Control name="note" value={formData.note} onChange={handleChange} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Salva Modifiche
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModaleModificaCategoria;