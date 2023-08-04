import { Component } from "react";
const axios = require("axios");

class Disponibilidad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre_articulo: "",
    };
    this.cambiar_nombre_articulo = this.cambiar_nombre_articulo.bind(this);
  }

  cambiar_nombre_articulo(event) {
    this.setState({ nombre_articulo: event.target.value });
  }


  show_complete_stock() {
    axios
      .get("http://localhost:3000/get_articulos")
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <div>
        <form
          className="bg-white p-4 h-100"
          onSubmit={(event) => event.preventDefault()}
        >
          <h1>Consultar Ventas</h1>
          <div className="form-group mt-3">
            <label className="pb-2">Nombre Articulo</label>
            <input
              type="text"
              className="form-control"
              value={this.state.nombre_articulo}
              onChange={this.cambiar_nombre_articulo}
            />
          </div>
          <button
            className="btn btn-primary mt-3"
            onClick={this.enviar_formulario}
          >
            Mostrar Stock del Artículo Indicado
          </button>



          <button
            className="btn btn-primary mt-3 ms-3"
            onClick={this.show_complete_stock}
          >
            Mostrar Stock Actual Completo
          </button>
        </form>
      </div>
    );
  }
}

export default Disponibilidad;
