import { Component } from "react";
import { Typeahead } from "react-bootstrap-typeahead"; // ES2015
const axios = require("axios");

function validarFormulario(factura) {
  if (!factura.nombre_articulo_cliente) {
    return "Error, se debe ingresar el nombre del articulo";
  }
  if (!factura.precio_venta || factura.precio_venta <= 0) {
    return "Error, se debe ingresar el precio de venta y debe ser mayor o igual a 0";
  }
  if (!factura.cantidad) {
    return "Error, se debe ingresar una cantidad";
  }

  return "ok";
}

class Registrar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_articulo: "",
      precio: 0,
      dni_cliente: "",
      nombre_apellido: "",
      cantidad: 1,
      error: "",
      articulos: axios
        .get("http://localhost:3000/get_articulos")
        .then((response) => console.log(response))
        .catch((error) => console.log(error)),
    };

    this.enviar_formulario = this.enviar_formulario.bind(this);
    this.cambiar_id_articulo = this.cambiar_id_articulo.bind(this);
    this.cambiar_precio = this.cambiar_precio.bind(this);
    this.cambiar_dni_cliente = this.cambiar_dni_cliente.bind(this);
    this.cambiar_nombre_apellido = this.cambiar_nombre_apellido.bind(this);
    this.cambiar_cantidad = this.cambiar_cantidad.bind(this);
  }

  cambiar_id_articulo(event) {
    this.setState({ id_articulo: event.target.value });
  }

  cambiar_precio(event) {
    this.setState({ precio: event.target.value });
  }
  cambiar_cantidad(event) {
    this.setState({ cantidad: event.target.value });
  }

  cambiar_dni_cliente(event) {
    this.setState({ dni_cliente: event.target.value });
  }

  cambiar_nombre_apellido(event) {
    this.setState({ nombre_apellido: event.target.value });
  }

  enviar_formulario() {
    const factura = {
      id: this.state.id_articulo,
      precio_venta: this.state.precio,
      dni_cliente: this.state.dni_cliente,
      nombre_y_apellido_cliente: this.state.nombre_apellido,
      cantidad: this.state.cantidad,
    };

    const validacion = validarFormulario(factura);

    if (validacion === "ok") {
      axios
        .post("http://localhost:3000/guardar_factura", factura)
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error));
    } else {
      this.setState({ error: validacion });
    }
  }

  render() {
    let message = <div> </div>;
    if (this.state.error) {
      message = (
        <div className="alert alert-warning" role="alert">
          {" "}
          {this.state.error}{" "}
        </div>
      );
    }

    return (
      <div>
        {" "}
        {message}{" "}
        <form
          className="bg-white p-4 h-100"
          onSubmit={(event) => event.preventDefault()}
        >
          <h1> Registrar Factura </h1>{" "}
          <div className="form-group mt-3">
            <label className="pb-2"> Nombre de Artículo </label>{" "}
            <Typeahead
              onChange={(selected) => {
                this.setState({ selected });
              }}
              options={[{ id: 1000, label: "nombre" }]}
              selected={this.state.id_articulo}
            />{" "}
          </div>{" "}
          <div className="form-group mt-3">
            <label className="pb-2"> Precio </label>{" "}
            <input
              type="number"
              className="form-control"
              value={this.state.precio}
              onChange={this.cambiar_precio}
            />{" "}
          </div>{" "}
          <div className="form-group mt-3">
            <label className="pb-2"> Cantidad </label>{" "}
            <input
              type="number"
              className="form-control"
              value={this.state.cantidad}
              onChange={this.cambiar_cantidad}
            />{" "}
          </div>{" "}
          <div className="form-group mt-3">
            <label className="pb-2"> DNI Cliente (Opcional) </label>{" "}
            <input
              type="text"
              className="form-control"
              value={this.state.dni_cliente}
              onChange={this.cambiar_dni_cliente}
            />{" "}
          </div>{" "}
          <div className="form-group mt-3">
            <label className="pb-2"> Nombre y Apellido Cliente (Opcional) </label>{" "}
            <input
              type="text"
              className="form-control"
              value={this.state.nombre_apellido}
              onChange={this.cambiar_nombre_apellido}
            />{" "}
          </div>{" "}
          <button
            className="btn btn-primary mt-3"
            onClick={this.enviar_formulario}
          >
            Cargar Factura{" "}
          </button>{" "}
        </form>{" "}
      </div>
    );
  }
}

export default Registrar;
