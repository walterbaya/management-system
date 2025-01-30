import { Component } from "react";
import Table from "react-bootstrap/Table";
import { Typeahead } from "react-bootstrap-typeahead";
import axios from "axios";
import QRCodeModule from "./Utilities/QRCodeModule";
import ReactPaginate from "react-paginate"; // Importar react-paginate

function getArticuloFullDescription(articulo) {
  return (
    articulo.id +
    "-" +
    articulo.name +
    "-" +
    articulo.leatherType +
    "-" +
    articulo.color +
    "-" +
    (articulo.gender ? "Hombre" : "Mujer") +
    "-" +
    articulo.shoeType +
    "-" +
    articulo.size
  ).toLowerCase();
}

function TableArticulos(props) {
  const { articulos, currentPage, itemsPerPage, handlePageClick } = props;

  // Calcula los artículos que se mostrarán en la página actual
  const startIndex = currentPage * itemsPerPage;
  const displayedArticulos = articulos.slice(startIndex, startIndex + itemsPerPage);

  let rows = <tr></tr>;
  if (displayedArticulos.length > 0) {
    rows = displayedArticulos.map((articulo, index) => (
      <tr key={articulo.id} style={{ backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white" }}>
        <td>
          <QRCodeModule url={articulo.id} data={getArticuloFullDescription(articulo) + ".png"} />
        </td>
        <td>{articulo.name}</td>
        <td>{articulo.size}</td>
        <td>{articulo.color}</td>
        <td>{articulo.leatherType}</td>
        <td>{articulo.shoeType}</td>
        <td>{articulo.gender ? "Hombre" : "Mujer"}</td>
        <td>{articulo.numberOfElements}</td>
        <td>{articulo.price}</td>
      </tr>
    ));
  }

  return (
    <div className="fixed_height p-4">
      <Table className={`table ${displayedArticulos.length > 0 ? "" : "d-none"}`}

       style={{ border: "2px solid blue" }} size="sm">
        <thead className="bg-primary text-white">
          <tr>
            <th>Identificador de Articulo</th>
            <th>Nombre Artículo</th>
            <th>Talle</th>
            <th>Color</th>
            <th>Cuero</th>
            <th>Tipo</th>
            <th>Genero</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>

    </div>
  );
}

/** */
class Disponibilidad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: [],
      articulos: [],
      articulos_typehead: [],
      currentPage: 0, // Página inicial
      itemsPerPage: 50, // Artículos por página
    };

    this.cambiar_name = this.cambiar_name.bind(this);
    this.mostrar_articulo = this.mostrar_articulo.bind(this);
    this.show_complete_stock = this.show_complete_stock.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  cambiar_name(event) {
    this.setState({ name: event.target.value });
  }

  componentDidMount() {
    axios
      .get("http://localhost:8080/api/public/product/get_products")
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
      .delete("http://localhost:8080/api/public/product/delete_product", {
        params: { id: id },
      })
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));

    axios
      .get("http://localhost:8080/api/public/product/get_products")
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
      articulos_encontrados[0].numberOfElements =
        parseInt(articulos_encontrados[0].numberOfElements) - 1;

      if (articulos_encontrados[0].numberOfElements !== 0) {
        articulos.push(articulos_encontrados[0]);
      }
    }

    axios
      .post("http://localhost:8080/api/public/product/add_product", articulos_encontrados[0])
      .then((response) => {
        axios
          .get("http://localhost:8080/api/public/product/get_products")
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
      .get("http://localhost:8080/api/public/product/get_products")
      .then((response) => {
        this.setState({ articulos: response.data });
      })
      .catch((error) => console.log(error));
  }

  handlePageClick(event) {
    this.setState({ currentPage: event.selected });
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
                "name",
                "shoeType",
                "leatherType",
                "color",
                "size",
                "gender",
              ]}
              labelKey={(option) =>
                `${option.name} ${option.shoeType} ${option.leatherType} ${option.color} ${option.size}`
              }
            />
          </div>
        </form>

        <TableArticulos
          articulos={this.state.articulos}
          currentPage={this.state.currentPage}
          itemsPerPage={this.state.itemsPerPage}
          //restar={this.restar_articulo.bind(this)}
          //eliminar={this.eliminar.bind(this)}
          handlePageClick={this.handlePageClick}
        />
      </div>
    );
  }
}

export default Disponibilidad;
