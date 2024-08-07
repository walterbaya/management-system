import { Component } from "react";
import { Typeahead } from "react-bootstrap-typeahead"; // ES2015
import Table from "react-bootstrap/Table";
import axios from "axios";

function validarFormulario(articulo, es_articulo) {
  if (
    es_articulo &&
    parseInt(articulo.articulo_cantidad) - parseInt(articulo.cantidad) < 0
  ) {
    return "No hay suficientes: " + articulo.nombre_articulo + " en el stock!";
  }

  if (!articulo.nombre_articulo) {
    return "Error, se debe ingresar el nombre del articulo";
  }
  if (!articulo.precio || articulo.precio <= 0) {
    return "Error, se debe ingresar el precio de venta y debe ser mayor o igual a 0";
  }
  if (!articulo.cantidad) {
    return "Error, se debe ingresar una cantidad";
  }

  return "ok";
}

function TableArticulos(props) {

  let rows = <tr></tr>;
  let res = <div className="fixed_height p-4"></div>;

  const carrito = props.carrito;

  if (carrito.articulos !== undefined && carrito.articulos.length > 0) {
    rows = carrito.articulos.map((articulo) => (
      <tr key={articulo.id_articulo}>
        <td>{articulo.nombre_articulo}</td>
        <td>{articulo.talle}</td>
        <td>{articulo.color}</td>
        <td>{articulo.cuero}</td>
        <td>{articulo.tipo}</td>
        <td>{articulo.genero ? "Mujer" : "Hombre"}</td>
        <td>{articulo.cantidad}</td>
        <td>{carrito.datos_cliente.nombre_apellido}</td>
        <td>{carrito.datos_cliente.dni_cliente}</td>
        <td>{articulo.precio * articulo.cantidad}</td>
        <td>
          <button className="btn btn-info text-white" onClick={e => props.restar(articulo.id_articulo, props.carrito.articulos)}>-</button>
        </td>
        <td>
          <button className="btn btn-danger text-white" onClick={e => props.eliminar(articulo.id_articulo, props.carrito.articulos)}>X</button>
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
              <th scope="col">Nombre y Apellido</th>
              <th scope="col">Dni Cliente</th>
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

class Registrar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      exito: "",

      //Articulo
      id_articulo: "",
      precio: 0,
      cantidad: 1,
      articulo: "",
      articulo_cantidad: "",
      nombre_articulo: "",
      talle: "",
      color: "",
      cuero: "",
      tipo: "",      
      carrito: {articulos: [], datos_cliente: {nombre_apellido: "", dni_cliente: ""}},
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
    //this.seleccionar_forma_pago = this.seleccionar_forma_pago.bind(this);
  }

  agregar_al_carrito() {
    const articulo = {
      id_articulo: this.state.id_articulo,
      nombre_articulo: this.state.nombre_articulo,
      talle: this.state.talle,
      color: this.state.color,
      cuero: this.state.cuero,
      tipo: this.state.tipo,      
      genero: this.state.genero === "hombre",
      articulo_cantidad: this.state.articulo_cantidad,
      cantidad: this.state.cantidad,
      precio: this.state.precio,  
    };

    const validacion = validarFormulario(articulo, false);

    if (validacion === "ok") {
      this.setState({ error: "" });
      let carrito = this.state.carrito;
      let articulos_encontrados = carrito.articulos.filter(
        (elem) => elem.id_articulo === this.state.id_articulo
      );

      articulos_encontrados.forEach(articulo => {
        articulo.precio = this.state.precio;
      });

      if (articulos_encontrados.length !== 0) {
        carrito.articulos = carrito.articulos.filter(
          (elem) => elem.id_articulo !== this.state.id_articulo
        );
        articulos_encontrados[0].cantidad =
          parseInt(articulos_encontrados[0].cantidad) +
          parseInt(this.state.cantidad);
        carrito.articulos.push(articulos_encontrados[0]);
      } else {
        carrito.articulos.push(articulo);

        this.setState({ carrito: carrito });
      }
    } else {
      this.setState({ error: validacion });
    }
  }

  eliminar(id){
    const carrito = this.state.carrito;
    let articulos_encontrados = carrito.articulos.filter(
      (elem) => elem.id_articulo !== id
    );

    this.setState(prevState => ({
      carrito: {
        ...prevState.carrito,
        articulos: articulos_encontrados
      }
    }));
  }

  restar_articulo(id) {
    let carrito = this.state.carrito;
    
    //Obtengo el articulo, pero esto trae una lista 
    const articulo = carrito.articulos.filter(
      (elem) => elem.id_articulo === id
    );

    //Si habia articulo tengo que restarle la cantidad
    if (articulo.length !== 0) {
      //Lo que tendria que hacer es cambiar
      const index = carrito.articulos.findIndex(articulo => articulo.id_articulo === id);
      
      articulo[0].cantidad = parseInt(articulo[0].cantidad) - 1;
      
      if(articulo[0].cantidad === 0){
        carrito.articulos.splice(index, 1);
      }
      else{
        carrito.articulos[index] =  articulo[0];
      }
      
    }

    this.setState({carrito: carrito});
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
      this.setState({ articulo_cantidad: articulo.cantidad });
    }
  }

  resetState() {
    this.setState({ id_articulo: "" });
    this.setState({ precio: 0 });
    this.setState({ dni_cliente: "" });
    this.setState({ nombre_apellido: "" });
    this.setState({ cantidad: 1 });
    this.setState({ articulo: "" });
    this.setState({nombre_articulo: ""})
    this.setState({ carrito: {articulos: [], datos_cliente: {nombre_apellido: "", dni_cliente: ""}}});
  }

  componentDidMount() {
    this.bringArticles();
  }

  bringArticles() {
    axios
      .get("http://localhost:3000/get_articulos")
      .then((response) => {
        let res = response.data;
        res.forEach((element) => {
          element.genero = element.genero ? "Mujer" : "Hombre";
        });

        this.setState({ articulos_typehead: res });
      })
      .catch((error) => console.log(error));
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

  cambiar_dni_cliente = (event) => {
    this.setState(prevState => ({
      carrito: {
        ...prevState.carrito,
        datos_cliente: {
          ...prevState.carrito.datos_cliente,
          dni_cliente: event.target.value
        }
      }
    }));
  };

  cambiar_nombre_apellido(event) {
    this.setState(prevState => ({
      carrito: {
        ...prevState.carrito,
        datos_cliente: {
          ...prevState.carrito.datos_cliente,
          nombre_apellido: event.target.value
        }
      }
    }));
  }

  cargar_factura() {
    //Se validan los articulos
    let validacion = "ok";
    this.state.carrito.articulos.forEach(articulo => {
        if (validarFormulario(articulo, true) !== "ok"){
          validacion = validarFormulario(articulo, true);
        }
      })

      
      if (validacion === "ok") {
        axios
          .post("http://localhost:3000/guardar_factura", this.state.carrito)
          .then((response) => {
            if (response.data === "success") {
              this.setState({ exito: "Factura Cargada Con Exito" });
              this.setState({ error: "" });
              this.resetState();
              this.bringArticles();
            }
          })
          .catch((error) => console.log(error));
      } else {
        this.setState({ error: validacion });
        this.setState({ exito: "" });
      }
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
    if (this.state.exito) {
      message = (
        <div className="alert alert-success" role="alert">
          {this.state.exito}
        </div>
      );
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">{message}</div>
          <div className="col-12">
            <form
              className="bg-white p-3 rounded"
              onSubmit={(event) => event.preventDefault()}
            >
              <h1 className="row px-2"> Registrar Venta </h1>
              <div className="row mt-3">
                <div className="form-group col-12 mt-2 mt-md-0 col-md-4">
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
                      "genero",
                    ]}
                    labelKey={(option) =>
                      `${option.nombre_articulo} ${option.tipo} ${option.cuero} ${option.color} ${option.talle} ${option.genero}`
                    }
                  />
                </div>

                <div className="form-group col-12 mt-2 mt-md-0 col-md-4">
                  <label className="pb-2"> DNI del Cliente (Opcional) </label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.carrito.datos_cliente.dni_cliente}
                    onChange={this.cambiar_dni_cliente}
                  />
                </div>
                <div className="form-group col-12 mt-2 mt-md-0 col-md-4">
                  <label className="pb-2">
                    Nombre y Apellido del Cliente(Opcional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.carrito.datos_cliente.nombre_apellido}
                    onChange={this.cambiar_nombre_apellido}
                  />
                </div>
              </div>

              <div className="row mt-3">
                <div className="form-group col-12 mt-2 mt-md-0 col-md-4">
                  <label className="pb-2"> Precio Por Unidad</label>
                  <input
                    type="number"
                    className="form-control"
                    value={this.state.precio}
                    onChange={this.cambiar_precio}
                  />
                </div>
                <div className="form-group col-12 mt-2 mt-md-0 col-md-4">
                  <label className="pb-2"> Cantidad </label>
                  <input
                    type="number"
                    className="form-control"
                    value={this.state.cantidad}
                    onChange={this.cambiar_cantidad}
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
              <TableArticulos carrito = {this.state.carrito} restar={this.restar_articulo.bind(this)}
              eliminar={this.eliminar.bind(this)}
              />

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
