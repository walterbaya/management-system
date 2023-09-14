import { Component } from "react";
import Table from "react-bootstrap/Table";
import { Typeahead } from "react-bootstrap-typeahead";
import axios from "axios";

function TableArticulos(props) {
  let rows = <tr></tr>;
  let res = <div className="fixed_height p-4"></div>;
  if (props.articulos !== undefined && props.articulos.length > 0) {
    rows = props.articulos.map((articulo) => (
      <tr key={articulo.id}>
        <td>{articulo.nombre_articulo}</td>
        <td>{articulo.talle}</td>
        <td>{articulo.color}</td>
        <td>{articulo.cuero}</td>
        <td>{articulo.tipo}</td>
        <td>{articulo.genero}</td>
        <td>{articulo.cantidad}</td>
        <td>{articulo.precio}</td>
        <td>{articulo.credito}</td>
        <td>{articulo.valor_cada_cuota}</td>
        <td><select className="form-select" aria-label="Default select example">
          <option selected value="1">1</option>
          <option value="3">3</option>
          <option value="6">6</option>
        </select></td>
      </tr>
    ));

    res = (
      <div className="fixed_height p-4">
        <Table className="table table-bordered hover" size="sm">
          <thead className="table-primary text-center">
            <tr>
              <th scope="col">Nombre Artículo</th>
              <th scope="col">Talle</th>
              <th scope="col">Color</th>
              <th scope="col">Cuero</th>
              <th scope="col">Tipo</th>
              <th scope="col">Genero</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Precio Débito, Efectivo o Transferencia</th>
              <th scope="col">Precio Crédito</th>
              <th scope="col">Valor Cuota</th>
              <th scope="col">Cantidad de Cuotas</th>
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
      nombre_articulo: [],
      articulos: [],
      articulos_typehead: []
    };
    this.cambiar_nombre_articulo = this.cambiar_nombre_articulo.bind(this);
    this.mostrar_articulo = this.mostrar_articulo.bind(this);
    this.show_complete_stock = this.show_complete_stock.bind(this);
  }

  cambiar_nombre_articulo(event) {
    this.setState({ nombre_articulo: event.target.value });
  }

  componentDidMount() {
    axios
      .get("http://localhost:3000/get_articulos")
      .then((response) => {
        this.setState({ articulos_typehead: response.data });
      })
      .catch((error) => console.log(error));
  }

  mostrar_articulo(selected) {
    this.setState({ articulos: selected });
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
          <h1>Consultar Stock</h1>
          <div className="form-group mt-3">
            <Typeahead
              id="typeahead-articulos"
              onChange={this.mostrar_articulo}
              options={this.state.articulos_typehead}
              filterBy={[
                "nombre_articulo",
                "tipo",
                "cuero",
                "color",
                "talle",
              ]}
              labelKey={(option) =>
                `${option.nombre_articulo} ${option.tipo} ${option.cuero} ${option.color} ${option.talle}`
              }

            />
          </div>
          <button
            className="btn btn-primary mt-3"
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
