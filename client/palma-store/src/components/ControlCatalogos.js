import { Component } from "react";
import { Card, Container } from "react-bootstrap";
import LoadExcelArticlesYesCatalogue from "./Utilities/LoadExcelArticlesYesCatalogue";
import "./ControlCatalogos.css";

class ControlCatalogos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      successMessage: null
    };
  }

  render() {
  
    return (
      <Container fluid className="p-4">
        <Card className="shadow border-0">
          <Card.Header className="bg-primary text-white">
            <h2 className="mb-0">
              <i className="fas fa-upload me-2"></i>
              Carga de Catálogos
            </h2>
          </Card.Header>

          <Card.Body>
            <div className="upload-section p-4 border rounded">
              <h4 className="mb-4">
                <i className="fas fa-file-excel me-2"></i>
                Cargar Catálogo desde Excel
              </h4>

              <LoadExcelArticlesYesCatalogue />

              <div className="mt-4 text-muted small">
                <p>
                  <i className="fas fa-info-circle me-2"></i>
                  El archivo debe estar en formato Excel (.xlsx) y seguir la estructura especificada.
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

export default ControlCatalogos;



