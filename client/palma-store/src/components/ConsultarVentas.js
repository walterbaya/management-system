import { Component } from "react";
import axios from "axios";
import PurchaseTable from "./Tables/PurchaseTable";

function get_date(val) {
  const date = new Date(val);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  return date.getFullYear() + "-" + month + "-" + day;
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
    let consulta = {
      fecha_desde: this.state.fecha_desde,
      fecha_hasta: this.state.fecha_hasta
    };

    const validacion = validarFormulario(consulta);
    if (validacion !== "ok") {
      this.setState({ error: validacion });
      return;
    }

    axios.get("http://localhost:8080/api/public/purchase/get_excel", {
      responseType: 'blob',
      params: consulta
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'archivo.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error("Error al intentar obtener el Excel:", error);
        this.setState({ error: "No se pudo descargar el archivo." });
      });
  }

  enviar_formulario() {
    let consulta = {
      fecha_desde: this.state.fecha_desde,
      fecha_hasta: this.state.fecha_hasta
    };

    const validacion = validarFormulario(consulta);
    if (validacion !== "ok") {
      this.setState({ error: validacion });
      return;
    }

    axios.get("http://localhost:8080/api/public/purchase/get_facturas_between", {
      params: consulta
    })
      .then((response) => this.setState({ purchases: response.data, error: null }))
      .catch((error) => {
        console.error("Error al obtener las facturas:", error);
        this.setState({ error: "No se pudieron obtener las facturas." });
      });
  }

  render() {
    return (
      <div>
        <form className="bg-white p-4 h-100" onSubmit={(event) => event.preventDefault()}>
          <h1>Consultar Ventas</h1>
          {this.state.error && <div className="alert alert-danger">{this.state.error}</div>}
          <div className="form-group mt-3">
            <label className="pb-2">Fecha Desde</label>
            <input
              type="date"
              className="form-control"
              value={this.state.fecha_desde}
              onChange={this.cambiar_fecha_desde}
            />
          </div>
          <div className="form-group mt-3">
            <label className="pb-2">Fecha Hasta</label>
            <input
              type="date"
              className="form-control"
              value={this.state.fecha_hasta}
              onChange={this.cambiar_fecha_hasta}
            />
          </div>
          <button className="btn btn-primary mt-3" onClick={this.enviar_formulario}>
            Obtener Ventas Registradas
          </button>
          <button className="btn btn-success mt-3 mx-3" onClick={this.obtener_excel}>
            Obtener Excel
          </button>
        </form>
        {this.state.purchases.length > 0 && (
          <div className="p-4 bg-white">
            <PurchaseTable listOfPurchases={this.state.purchases} />
          </div>
        )}
      </div>
    );
  }
}

export default Consultar;
