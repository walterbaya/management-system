import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import QrReader from "react-qr-scanner";
import * as XLSX from "xlsx";
import axios from "axios";

/*
function get_list_articulos(sheet) {
  let res = [];

  sheet.forEach((sheet_obj) => {
    Object.keys(sheet_obj).forEach((key) => {
      const obj = {
        nombre_articulo: "",
        talle: "",
        color: "",
        cuero: "",
        tipo: "",
        genero: "",
        cantidad: "",
        precio: "",
      };
      const talle = parseInt(key);
      if (talle <= 46 && talle >= 35) {
        obj.nombre_articulo = sheet_obj.ARTICULO;
        obj.talle = talle;
        obj.color = sheet_obj.COLOR;
        obj.cuero = sheet_obj.CUERO;
        obj.tipo = sheet_obj.TIPO;
        obj.genero = sheet_obj.GENERO === "M" ? true : false;
        obj.cantidad = sheet_obj[key];
        obj.precio = sheet_obj.PRECIO;
        console.log(obj);
        res.push(obj);
      }
    });
  });

  console.log(res);
  return res;
}
*/

function QrReaderModule() {
  const [show, setShow] = useState(false);
  const [delay, setDelay] = useState(100);
  const [result, setResult] = useState("No result");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const previewStyle = {
    height: 320,
    width: 400
  };

  const  handleScan = (data) => {
    if(data){
      setResult(data.text);
      saveArticle(data.text)
    }
  }

  const handleError = (err) => {
    console.error(err);
  }


  const saveArticle = (e) => {
   
  };


  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Escanear Articulos
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Escanear Articulos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <QrReader
              delay={delay}
              onError={handleError}
              style={previewStyle}
              onScan={handleScan}
            />
          <p>{result}</p>
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

export default QrReaderModule;
