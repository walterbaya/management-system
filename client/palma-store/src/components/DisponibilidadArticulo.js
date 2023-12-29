import { Component } from "react";
import Table from "react-bootstrap/Table";
import { Typeahead } from "react-bootstrap-typeahead";
import axios from "axios";
import QRCode from "react-qr-code";

function TableArticulos(props) {
  let rows = <tr></tr>;
  let res = <div className="fixed_height p-4"></div>;
  if (props.articulos !== undefined && props.articulos.length > 0) {
    rows = props.articulos.map((articulo) => (
      <tr key={articulo.id}>
        <td>
          <QRCode value={articulo.id} size={50}></QRCode>
        </td>
        <td>{articulo.nombre_articulo}</td>
        <td>{articulo.talle}</td>
        <td>{articulo.color}</td>
        <td>{articulo.cuero}</td>
        <td>{articulo.tipo}</td>
        <td>{articulo.genero ? "Hombre" : "Mujer"}</td>
        <td>{articulo.cantidad}</td>
        <td>{articulo.precio}</td>
        <td>
          <button
            className="btn btn-info text-white"
            onClick={(e) => props.restar(articulo.id, props.articulos)}
          >
            -
          </button>
        </td>
        <td>
          <button
            className="btn btn-danger text-white"
            onClick={(e) => props.eliminar(articulo.id, props.articulos)}
          >
            X
          </button>
        </td>
      </tr>
    ));

    res = (
      <div className="fixed_height p-4">
        <Table className="table table-bordered hover" size="sm">
          <thead className="table-primary text-center">
            <tr>
              <th scope="col">Identificador de Articulo</th>
              <th scope="col">Nombre Artículo</th>
              <th scope="col">Talle</th>
              <th scope="col">Color</th>
              <th scope="col">Cuero</th>
              <th scope="col">Tipo</th>
              <th scope="col">Genero</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Precio</th>
              <th scope="col"></th>
              <th scope="col"></th>
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
      articulos_typehead: [],
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

  eliminar(id, carrito) {
    this.setState({
      articulos: carrito.filter((elem) => elem.id !== id),
    });
    axios
      .delete("http://localhost:3000/delete_articulo/" + id)
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));

    axios
      .get("http://localhost:3000/get_articulos")
      .then((response) => {
        this.setState({ articulos_typehead: response.data });
      })
      .catch((error) => console.log(error));
  }

  restar_articulo(id, carrito) {
    let articulos = carrito;
    let articulos_encontrados = carrito.filter((elem) => elem.id === id);

    if (articulos_encontrados.length !== 0) {
      articulos = carrito.filter((elem) => elem.id !== id);
      articulos_encontrados[0].cantidad =
        parseInt(articulos_encontrados[0].cantidad) - 1;

      if (articulos_encontrados[0].cantidad !== 0) {
        articulos.push(articulos_encontrados[0]);
      }
    }

    axios
      .post("http://localhost:3000/agregar_articulo", articulos_encontrados[0])
      .then((response) => {
        axios
          .get("http://localhost:3000/get_articulos")
          .then((response) => {
            this.setState({ articulos_typehead: response.data });
            let articulos_temp = this.state.articulos;
            if (articulos_temp.length > 1) {
              this.setState({ articulos: articulos_temp });
            } else {
              articulos_temp.pop();
              const elem = this.state.articulos_typehead.filter(
                (elem) => elem.id === id
              );
              articulos_temp.push(elem[0]);
              this.setState({ articulos: articulos_temp });
            }
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
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
              filterBy={() => true}
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
          <button className="btn btn-primary mt-3 ms-3">
            Regresar Stock a Versión Anterior
          </button>
        </form>
        <TableArticulos
          articulos={this.state.articulos}
          restar={this.restar_articulo.bind(this)}
          eliminar={this.eliminar.bind(this)}
        />
      </div>
    );
  }
}

export default Disponibilidad;
