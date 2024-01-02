import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import QrReader from "react-qr-scanner";
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
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleScan = (data) => {
    if (data) {
      console.log(data.text);
      setResult(data.text);
      saveArticle(data.text);
      setScanned(true);
    }
  };

  const saveArticle = (id) => {
    //Traemos el articulo desde la base de datos primero y luego lo pisamos

    const factura = {
      id: id,
      nombre_articulo: "",
      talle: "",
      cantidad: "",
      color: "",
      exito: "",
      cuero: "",
      genero: "",
      tipo: "",
      precio: "",
    };

    axios
      .post("http://localhost:3000/agregar_articulo", factura)
      .then((response) => {
        console.log(response.data);
        //this.setState({ exito: "Articulo guardado con exito" });
      })
      .catch((error) => console.log(error));
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
        <Modal.Body className="scanner-altura-fija">
          {(scanned && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setScanned(false);
                setResult("");
              }}
            >
              Escanear Siguiente
            </button>
          )) ||
            (!scanned && (
              <div>
                <QrReader
                  style={{ width: "100%" }}
                  onError={(error) => console.log(error)}
                  onScan={handleScan}
                />
                <p>{result}</p>
              </div>
            ))}
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
