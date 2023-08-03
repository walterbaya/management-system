import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import * as XLSX from "xlsx";

function LoadExcel() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFileUpload = () => {

  };


  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Cargar Excel con Artículos
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cargar Excel con Datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Todos los articulos anteriormente cargados serán eliminados y reemplazados por la información que se suministre en este Excel.

          <input type='file' accept='.xlsx, .xls' onChange={handleFileUpload}/>
        </Modal.Body>



        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoadExcel;