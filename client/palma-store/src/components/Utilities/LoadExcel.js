import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import * as XLSX from "xlsx";
import { FileUploader } from "react-drag-drop-files";
const axios = require("axios");

function LoadExcel() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
  
      axios
      .post("http://localhost:3000/registrar_articulos", XLSX.utils.sheet_to_json(sheet))
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));
    }
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

          <p>Todos los articulos anteriormente cargados serán eliminados y reemplazados por la información que se suministre en este Excel.</p>

          <FileUploader classes="drop_zone" handleChange={handleFileUpload} name="file"
            hoverTitle=" "
          />
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