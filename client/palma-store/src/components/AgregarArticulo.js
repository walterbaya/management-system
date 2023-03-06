import { Component } from "react";
const axios = require("axios");

function validarFormulario(factura) {
  if (!factura.nombre_articulo_cliente) {
    return "Error, se debe ingresar el nombre del articulo";
  }
  if (!factura.precio_venta || factura.precio_venta <= 0) {
    return "Error, se debe ingresar el precio de venta y debe ser mayor o igual a 0";
  }

  return "ok";
}

class AgregarArticulo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre_articulo: "",
      precio: 0,
      error: "",
    };

    this.enviar_formulario = this.enviar_formulario.bind(this);
    this.cambiar_nombre_articulo = this.cambiar_nombre_articulo.bind(this);
    this.cambiar_precio = this.cambiar_precio.bind(this);
  }

  cambiar_nombre_articulo(event) {
    this.setState({ nombre_articulo: event.target.value });
  }

  cambiar_precio(event) {
    this.setState({ precio: event.target.value });
  }

  enviar_formulario() {
    const factura = {
      nombre_articulo_cliente: this.state.nombre_articulo,
      precio_venta: this.state.precio,
    };

    const validacion = validarFormulario(factura);

    if (validacion === "ok") {
      axios
        .post("http://localhost:3000/agregar_articulo", factura)
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error));
    } else {
      this.setState({ error: validacion });
    }
  }

  render() {
    let message = <div></div>;
    if(this.state.error){
      message =  <div className="alert alert-warning" role="alert">{this.state.error}</div>;
    }
 
    return (
      <div>
        {message}        
        <form
          className="bg-white p-4 h-100"
          onSubmit={(event) => event.preventDefault()}
        >
          <h1>Agregar Articulo</h1>
          <div className="form-group mt-3">
            <label className="pb-2">Nombre de Artículo</label>
            <input
              type="text"
              className="form-control"
              value={this.state.nombre_articulo}
              onChange={this.cambiar_nombre_articulo}
            />
          </div>
          <div className="form-group mt-3">
            <label className="pb-2">Precio</label>
            <input
              type="number"
              className="form-control"
              value={this.state.precio}
              onChange={this.cambiar_precio}
            />
          </div>
          <button
            className="btn btn-primary mt-3"
            onClick={this.enviar_formulario}
          >
            Agregar Artículo
          </button>
        </form>
      </div>
    );
  }
}

export default AgregarArticulo;
