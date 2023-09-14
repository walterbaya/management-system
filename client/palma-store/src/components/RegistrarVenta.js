import { Component } from "react";
import { Typeahead } from "react-bootstrap-typeahead"; // ES2015
import Table from "react-bootstrap/Table";
import axios from "axios";

function validarFormulario(factura) {
  console.log(factura);
  if (!factura.nombre_articulo) {
    return "Error, se debe ingresar el nombre del articulo";
  }
  if (!factura.precio || factura.precio <= 0) {
    return "Error, se debe ingresar el precio de venta y debe ser mayor o igual a 0";
  }
  if (!factura.cantidad) {
    return "Error, se debe ingresar una cantidad";
  }

  return "ok";
}

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
        <td>
          <select className="form-select" aria-label="Default select example">
            <option value="1">1</option>
            <option value="3">3</option>
            <option value="6">6</option>
          </select>
        </td>
      </tr>
    ));

    res = (
      <div className="fixed_height">
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
      articulo: "",
      credito: 0,
      porcentaje: 15,
      valor_cada_cuota: 0,
      forma_pago: "efectivo",
      carrito: [],
      articulos_typehead: [],
    };

    this.cargar_factura = this.cargar_factura.bind(this);
    this.cambiar_id_articulo = this.cambiar_id_articulo.bind(this);
    this.cambiar_precio = this.cambiar_precio.bind(this);
    this.cambiar_dni_cliente = this.cambiar_dni_cliente.bind(this);
    this.cambiar_nombre_apellido = this.cambiar_nombre_apellido.bind(this);
    this.cambiar_cantidad = this.cambiar_cantidad.bind(this);
    this.traer_articulo = this.traer_articulo.bind(this);
    this.agregar_al_carrito = this.agregar_al_carrito.bind(this);
    this.seleccionar_forma_pago = this.seleccionar_forma_pago.bind(this);
  }

  agregar_al_carrito() {
    let carrito = this.state.carrito;
    let articulos_encontrados = carrito.filter(
      (elem) => elem.id === this.state.id_articulo
    );
    if (articulos_encontrados.length !== 0) {
      carrito = carrito.filter((elem) => elem.id !== this.state.id_articulo);
      articulos_encontrados[0].cantidad =
        parseInt(articulos_encontrados[0].cantidad) +
        parseInt(this.state.cantidad);
      carrito.push(articulos_encontrados[0]);
    } else {
      const json = {
        id: this.state.id_articulo,
        nombre_articulo: this.state.nombre_articulo,
        color: this.state.color,
        talle: this.state.talle,
        cuero: this.state.cuero,
        genero: this.state.tipo,
        precio: this.state.credito !==0 ? this.state.credito : this.state.precio,
        cantidad: this.state.cantidad,
        dni_cliente: this.state.dni_cliente,
      };

      carrito.push(json);
    }

    this.setState({ carrito: carrito });
  }

  seleccionar_forma_pago(event) {
    this.setState({ forma_pago: event.target.value });
    if (this.state.forma_pago !== "efectivo") {
      this.setState({ credito: 0 });
    } else {
      this.setState({
        credito:
          parseInt(parseFloat(this.state.precio) +
          (parseFloat(this.state.precio) * this.state.porcentaje) / 100),
      });
    }
  }

  traer_articulo(selected) {
    if (selected[0] !== undefined) {
      const articulo = selected[0];
      this.setState({ id_articulo: articulo.id });
      this.setState({ nombre_articulo: articulo.nombre_articulo });
      this.setState({ color: articulo.color });
      this.setState({ talle: articulo.talle });
      this.setState({ cuero: articulo.cuero });
      this.setState({ genero: articulo.genero });
      this.setState({ tipo: articulo.tipo });
      this.setState({ precio: articulo.precio });
    }
  }

  componentDidMount() {
    axios
      .get("http://localhost:3000/get_articulos")
      .then((response) => {
        this.setState({ articulos_typehead: response.data });
      })
      .catch((error) => console.log(error));

    /*
    axios
      .get("http://localhost:3000/get_variables")
      .then((response) => {
        this.setState({ porcentaje: response.data });
      })
      .catch((error) => console.log(error));
      */
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

  cargar_factura() {
    this.state.carrito.forEach((factura) => {
      const validacion = validarFormulario(factura);

      if (validacion === "ok") {
        axios
          .post("http://localhost:3000/guardar_factura", factura)
          .then((response) => console.log(response.data))
          .catch((error) => console.log(error));
      } else {
        this.setState({ error: validacion });
      }
    });
  }

  render() {
    let message = <div> </div>;
    if (this.state.error) {
      message = (
        <div className="alert alert-warning" role="alert">
          {this.state.error}
        </div>
      );
    }

    return (
      <div className="container-fluid">
        <div className="row">
          {message}
          <div className="col-12">
            <form
              className="bg-white p-3 rounded"
              onSubmit={(event) => event.preventDefault()}
            >
              <h1 className="row px-2"> Registrar Venta </h1>
              <div className="row mt-3">
                <div className="form-group col-6">
                  <label className="pb-2"> Nombre de Artículo </label>
                  <Typeahead
                    id="typeahead-articulos"
                    onChange={this.traer_articulo}
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
                <div className="form-group col-3">
                  <label className="pb-2">Forma de Pago</label>
                  <select
                    className="form-select"
                    value={this.state.forma_pago}
                    onChange={this.seleccionar_forma_pago}
                    aria-label="Default select example"
                  >
                    <option value="efectivo">Efectivo / Debito</option>
                    <option value="credito">Credito</option>
                  </select>
                </div>
                <div className="form-group col-3">
                  <label className="pb-2"> Precio </label>
                  <input
                    type="number"
                    className="form-control"
                    value={
                      this.state.credito !== 0
                        ? this.state.credito
                        : this.state.precio
                    }
                    onChange={this.cambiar_precio}
                  />
                </div>
              </div>

              <div className="row mt-3">
                <div className="form-group col-2">
                  <label className="pb-2"> Cantidad </label>
                  <input
                    type="number"
                    className="form-control"
                    value={this.state.cantidad}
                    onChange={this.cambiar_cantidad}
                  />
                </div>
                <div className="form-group col-5">
                  <label className="pb-2"> DNI del Cliente (Opcional) </label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.dni_cliente}
                    onChange={this.cambiar_dni_cliente}
                  />
                </div>
                <div className="form-group col-5">
                  <label className="pb-2">
                    Nombre y Apellido del Cliente(Opcional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.nombre_apellido}
                    onChange={this.cambiar_nombre_apellido}
                  />
                </div>
              </div>
              <button
                className="btn btn-primary mt-3"
                onClick={this.agregar_al_carrito}
              >
                Agregar al Carrito
              </button>
            </form>
          </div>
          <div className="col-12 my-2">
            <div className="p-3 bg-white rounded">
              <h1>Carrito</h1>
              <TableArticulos articulos={this.state.carrito} />

              <button
                className="btn btn-primary mt-2"
                onClick={this.cargar_factura}
              >
                Cargar Factura
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Registrar;
