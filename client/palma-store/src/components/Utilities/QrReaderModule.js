import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import QrReader from "react-qr-scanner";
import axios from "axios";

function QrReaderModule({ onArticleScanned }) {
  const [show, setShow] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [success, setSuccess] = useState(false);
  const [articulo, setArticulo] = useState({});
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
    axios
      .get("http://localhost:8080/api/public/product/get_product/" + id)
      .then((response) => {
        const articulo = response.data[0];
        setArticulo(articulo);
        setSuccess(true);
        // Llama a la función de callback pasando el artículo escaneado
        if (onArticleScanned) {
          onArticleScanned(articulo);
        }
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
        <Modal.Body>
          {(scanned && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setScanned(false);
                setArticulo({});
                setSuccess(false);
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

          {success === true ? (
            <div className="mt-3 p-3 w-100 text-dark">
              <h3>Carga Exitosa</h3>
              <h4>Descripción del articulo cargado</h4>
              <ul className="list-group mt-3">
                <li className="list-group-item">Nombre: {articulo.nombre_articulo}</li>
                <li className="list-group-item">Cuero: {articulo.cuero}</li>
                <li className="list-group-item">Color: {articulo.color}</li>
                <li className="list-group-item">Genero: {articulo.genero ? "Hombre": "Mujer"}</li>
                <li className="list-group-item">Talle: {articulo.talle}</li>
                <li className="list-group-item">Tipo: {articulo.tipo }</li>
                <li className="list-group-item">Cantidad: {articulo.cantidad }</li>
              </ul>
            </div>
          ) : (
            <div></div>
          )}
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