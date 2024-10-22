import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import * as XLSX from "xlsx";
import { FileUploader } from "react-drag-drop-files";

function get_list_articulos(sheet) {
  let res = [];

  sheet.forEach((sheet_obj) => {
    const obj = {
      nombre_articulo: "",
      tipo: "",
      precio: "",
    };

    obj.nombre_articulo = sheet_obj.nombre_articulo;
    obj.tipo = sheet_obj.tipo;
    obj.precio = sheet_obj.precio;
    res.push(obj);
  });

  return res;
}

function LoadExcelArticlesYesCatalogue() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const xlsx_sheet = XLSX.utils.sheet_to_json(sheet);
      const json = get_list_articulos(xlsx_sheet);


      console.log(json)
      // Enviar el JSON al servidor para que se guarde en la carpeta específica
      fetch("http://localhost:8080/api/public/product/update_catalogue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(json),
      })
        .then((response) => {
          if (response.ok) {
            console.log("Archivo JSON enviado al servidor con éxito");
          } else {
            console.error("Error al enviar el archivo JSON al servidor");
          }
        })
        .catch((error) => {
          console.error("Error en la solicitud:", error);
        });
    };
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Cargar Excel Para El Catalogo YES
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <h1 className="row px-2"> Cargar Excel YES</h1>
        </Modal.Header>
        <Modal.Body>
          <p>
            Todos los articulos anteriormente cargados serán eliminados y
            reemplazados por la información que se suministre en este Excel.
          </p>

          <FileUploader
            classes="drop_zone"
            handleChange={handleFileUpload}
            name="file"
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

export default LoadExcelArticlesYesCatalogue;
