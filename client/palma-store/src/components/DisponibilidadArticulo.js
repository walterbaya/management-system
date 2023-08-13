import { Component } from "react";
import Table from "react-bootstrap/Table";
const axios = require("axios");

function TableArticulos(props) {
  let rows = <tr></tr>;
  let res = <div className="fixed_height p-4"></div>;
  if (typeof props.articulos !== "undefined" && props.articulos.length > 0) {
    rows = props.articulos.map((articulo) => (
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

    res = (
      <div className="fixed_height p-4">
        <Table className="table table-bordered hover" size="sm">
          <thead  class="table-primary text-center">
            <tr>
              <th scope="col">Nombre Artículo</th>
              <th scope="col">Talle</th>
              <th scope="col">Color</th>
              <th scope="col">Cuero</th>
              <th scope="col">Tipo</th>
              <th scope="col">Genero</th>
              <th scope="col">Cantidad</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    );
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
      <div className="bg-white h-100">
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
        <TableArticulos articulos={this.state.articulos} />
      </div>
    );
  }
}

export default Disponibilidad;
