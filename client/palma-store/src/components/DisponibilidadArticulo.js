import { Component } from "react";
import Table from "react-bootstrap/Table";
const axios = require("axios");

function Row(props) {
  let res = <tr></tr>;
  if (typeof(props.articulos) !== "undefined" && props.articulos.length > 0) {
    res = props.articulos.map((articulo) => (
      <tr key={articulo.id}>
        <td>{articulo.nombre_articulo}</td>
        <td>{articulo.talle}</td>
        <td>{articulo.color}</td>
        <td>{articulo.cuero}</td>
        <td>{articulo.tipo}</td>
        <td>{articulo.genero}</td>
        <td>{articulo.cantidad}</td>
      </tr>
    ));
  }

  return res;
}

class Disponibilidad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre_articulo: "",
      articulos: [],
    };
    this.cambiar_nombre_articulo = this.cambiar_nombre_articulo.bind(this);
    this.show_complete_stock = this.show_complete_stock.bind(this);
  }

  cambiar_nombre_articulo(event) {
    this.setState({ nombre_articulo: event.target.value });
  }

  show_complete_stock() {
    axios
      .get("http://localhost:3000/get_articulos")
      .then((response) => {
        this.setState({ articulos: response.data });
      })
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <div className="bg-white">
        <form className="p-4" onSubmit={(event) => event.preventDefault()}>
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

        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Nombre Artículo</th>
              <th>Talle</th>
              <th>Color</th>
              <th>Cuero</th>
              <th>Tipo</th>
              <th>Genero</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody><Row articulos={this.state.articulos}/></tbody>
        </Table>
      </div>
    );
  }
}

export default Disponibilidad;
