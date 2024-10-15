import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import * as XLSX from "xlsx";
import { FileUploader } from "react-drag-drop-files";
import fs from 'fs';

function get_list_articulos(sheet) {
  let res = [];

  sheet.forEach((sheet_obj) => {
    Object.keys(sheet_obj).forEach((key) => {
      const obj = {
        nombre_articulo: "",
        tipo: "",
        precio: "",
      };
      
      obj.nombre_articulo = sheet_obj.ARTICULO;
      obj.tipo = sheet_obj.TIPO;
      obj.precio = sheet_obj.PRECIO;
      console.log(obj);
      res.push(obj);
    });
  });

  console.log(res);
  return res;
}

function LoadExcelArticlesYesCatalogue() {
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
      const xlsx_sheet = XLSX.utils.sheet_to_json(sheet);
      const json = get_list_articulos(xlsx_sheet);

      //En vez de llamar al sevidor generamos el archivo directamente

      const writeJsonToFile = (path, data) => {
        try {
          fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8')
          console.log('Data successfully saved to disk')
        } catch (error) {
          console.log('An error has occurred ', error)
       }
      }

      writeJsonToFile('my-data.json', json);
  
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
