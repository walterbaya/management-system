import { Component } from "react";
import { Card, Form, Button, Alert, Container } from "react-bootstrap";
import axios from "axios";
import PurchaseTable from "./Tables/PurchaseTable";

function get_date(val) {
  const date = new Date(val);
  return date.toISOString().split('T')[0];
}

function validarFormulario(consulta) {
  if (!consulta.fecha_desde) {
    return "Error, se debe ingresar una fecha desde";
  }
  if (!consulta.fecha_hasta) {
    return "Error, se debe ingresar una fecha hasta";
  }
  if (consulta.fecha_desde > consulta.fecha_hasta) {
    return "Error, fecha hasta tiene que ser superior o igual a fecha desde.";
  }
  return "ok";
}

class Consultar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fecha_hasta: get_date(new Date()),
      fecha_desde: get_date(new Date(new Date().setDate(new Date().getDate() - 1))),
      purchases: [],
      error: null,
      loading: false,
      excelLoading: false
    };

    this.cambiar_fecha_desde = this.cambiar_fecha_desde.bind(this);
    this.cambiar_fecha_hasta = this.cambiar_fecha_hasta.bind(this);
    this.enviar_formulario = this.enviar_formulario.bind(this);
    this.obtener_excel = this.obtener_excel.bind(this);
  }

  cambiar_fecha_desde(event) {
    this.setState({ fecha_desde: event.target.value });
  }

  cambiar_fecha_hasta(event) {
    this.setState({ fecha_hasta: event.target.value });
  }

  obtener_excel() {
    const consulta = {
      fecha_desde: this.state.fecha_desde,
      fecha_hasta: this.state.fecha_hasta
    };

    const validacion = validarFormulario(consulta);
    if (validacion !== "ok") {
      this.setState({ error: validacion });
      return;
    }

    this.setState({ excelLoading: true });

    axios.get("http://localhost:8081/api/public/purchase/get_excel", {
      responseType: 'blob',
      params: consulta
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `ventas_${this.state.fecha_desde}_${this.state.fecha_hasta}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        this.setState({ error: null });
      })
      .catch((error) => {
        console.error("Error al intentar obtener el Excel:", error);
        this.setState({ error: "No se pudo descargar el archivo." });
      })
      .finally(() => {
        this.setState({ excelLoading: false });
      });
  }

  enviar_formulario() {
    const consulta = {
      fecha_desde: this.state.fecha_desde,
      fecha_hasta: this.state.fecha_hasta
    };

    const validacion = validarFormulario(consulta);
    if (validacion !== "ok") {
      this.setState({ error: validacion });
      return;
    }

    this.setState({ loading: true });

    axios.get("http://localhost:8081/api/public/purchase/get_facturas_between", {
      params: consulta
    })
      .then((response) => {
        this.setState({ 
          purchases: response.data, 
          error: null,
          loading: false
        });
      })
      .catch((error) => {
        console.error("Error al obtener las facturas:", error);
        this.setState({ 
          error: "No se pudieron obtener las facturas.",
          loading: false
        });
      });
  }

  render() {
    const { fecha_desde, fecha_hasta, purchases, error, loading, excelLoading } = this.state;

    return (
      <Container fluid className="p-4">
        <Card className="shadow border-0">
          <Card.Header className="bg-primary text-white">
            <h2 className="mb-0">
              <i className="fas fa-chart-line me-2"></i>
              Consulta de Ventas
            </h2>
          </Card.Header>

          <Card.Body>
            <Form onSubmit={(e) => e.preventDefault()}>
              {error && (
                <Alert variant="danger" className="animate__animated animate__headShake">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Fecha Desde</Form.Label>
                    <Form.Control
                      type="date"
                      value={fecha_desde}
                      onChange={this.cambiar_fecha_desde}
                      max={fecha_hasta}
                    />
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Fecha Hasta</Form.Label>
                    <Form.Control
                      type="date"
                      value={fecha_hasta}
                      onChange={this.cambiar_fecha_hasta}
                      min={fecha_desde}
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="d-flex gap-3 mt-4">
                <Button
                  variant="primary"
                  onClick={this.enviar_formulario}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Cargando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search me-2"></i>
                      Buscar Ventas
                    </>
                  )}
                </Button>

                <Button
                  variant="success"
                  onClick={this.obtener_excel}
                  disabled={excelLoading}
                >
                  {excelLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Generando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-file-excel me-2"></i>
                      Exportar Excel
                    </>
                  )}
                </Button>
              </div>
            </Form>

            {purchases.length > 0 && (
              <div className="mt-5">
                <h4 className="mb-3">
                  <i className="fas fa-list-alt me-2"></i>
                  Resultados de la Búsqueda
                </h4>
                <div className="card shadow-sm">
                  <div className="card-body p-0">
                    <PurchaseTable listOfPurchases={purchases} />
                  </div>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

export default Consultar;