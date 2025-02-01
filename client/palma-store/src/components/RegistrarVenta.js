import { Component } from "react";
import { Typeahead } from "react-bootstrap-typeahead"; // ES2015
import QrReaderModule from "./Utilities/QrReaderModule";
import Table from "react-bootstrap/Table";
import axios from "axios";

function validarFormulario(articulo, es_articulo) {
  console.log(articulo.cantidad);
  console.log(articulo.cantidad <= 0);

  if (
    es_articulo && (parseInt(articulo.numberOfElements) < 0)
  ) {
    return "No hay suficientes: " + articulo.name + " en el stock!";
  }

  if (!articulo.name) {
    return "Error, se debe ingresar el nombre del articulo";
  }
  if (!articulo.price || articulo.price <= 0) {
    return "Error, se debe ingresar el precio de venta y debe ser mayor a 0";
  }
  if (articulo.cantidad <= 0 || !articulo.cantidad) {
    return "Error, se debe ingresar una cantidad de elementos mayor a 0";
  }


  return "ok";
}

function Tableproducts(props) {

  let rows = <tr></tr>;
  let res = <div className="fixed_height p-4"></div>;

  const carrito = props.carrito;

  if (carrito.products !== undefined && carrito.products.length > 0) {
    rows = carrito.products.map((articulo) => (
      <tr key={articulo.idProduct}>
        <td>{articulo.name}</td>
        <td>{articulo.size}</td>
        <td>{articulo.color}</td>
        <td>{articulo.leatherType}</td>
        <td>{articulo.shoeType}</td>
        <td>{articulo.gender ? "Hombre" : "Dama"}</td>
        <td>{articulo.cantidad}</td>
        <td>{carrito.clientInfo.clientNameAndSurname}</td>
        <td>{carrito.clientInfo.clientDni}</td>
        <td>{articulo.price * articulo.cantidad}</td>
        <td>
          <button className="btn btn-info text-white" onClick={e => props.restar(articulo.idProduct, props.carrito.products)}>-</button>
        </td>
        <td>
          <button className="btn btn-danger text-white" onClick={e => props.eliminar(articulo.idProduct, props.carrito.products)}>X</button>
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
      idProduct: "",
      price: 0,
      articulo: "",
      numberOfElements: "",
      cantidad: 0,
      name: "",
      size: "",
      color: "",
      leatherType: "",
      shoeType: "",
      carrito: { products: [], clientInfo: { clientNameAndSurname: "", clientDni: "" } },
      products_typehead: [],
    };

    this.cargar_factura = this.cargar_factura.bind(this);
    this.cambiar_id = this.cambiar_id.bind(this);
    this.cambiar_price = this.cambiar_price.bind(this);
    this.cambiar_clientDni = this.cambiar_clientDni.bind(this);
    this.cambiar_clientNameAndSurname = this.cambiar_clientNameAndSurname.bind(this);
    this.cambiar_numberOfElements = this.cambiar_numberOfElements.bind(this);
    this.cambiar_cantidad = this.cambiar_cantidad.bind(this);
    this.traer_articulo = this.traer_articulo.bind(this);
    this.agregar_al_carrito = this.agregar_al_carrito.bind(this);
    //this.seleccionar_forma_pago = this.seleccionar_forma_pago.bind(this);
  }

  agregar_al_carrito() {
    const articulo = {
      idProduct: this.state.idProduct,
      name: this.state.name,
      size: this.state.size,
      color: this.state.color,
      leatherType: this.state.leatherType,
      shoeType: this.state.shoeType,
      gender: this.state.gender === "Hombre",
      cantidad: this.state.cantidad,
      price: this.state.price,
    };

    const validacion = validarFormulario(articulo, false);

    if (validacion === "ok") {
      this.setState({ error: "" });
      let carrito = this.state.carrito;
      let products_encontrados = carrito.products.filter(
        (elem) => elem.idProduct === this.state.idProduct
      );

      products_encontrados.forEach(articulo => {
        articulo.price = this.state.price;
      });

      if (products_encontrados.length !== 0) {
        carrito.products = carrito.products.filter(
          (elem) => elem.idProduct !== this.state.idProduct
        );
        products_encontrados[0].cantidad = parseInt(this.state.cantidad);
        carrito.products.push(products_encontrados[0]);
      } else {
        carrito.products.push(articulo);

        this.setState({ carrito: carrito });
      }
    } else {
      this.setState({ error: validacion });
    }
  }

  eliminar(idProduct) {
    const carrito = this.state.carrito;
    let products_encontrados = carrito.products.filter(
      (elem) => elem.idProduct !== idProduct
    );

    this.setState(prevState => ({
      carrito: {
        ...prevState.carrito,
        products: products_encontrados
      }
    }));
  }

  restar_articulo(idProduct) {
    let carrito = this.state.carrito;

    //Obtengo el articulo, pero esto trae una lista 
    const articulo = carrito.products.filter(
      (elem) => elem.idProduct === idProduct
    );

    //Si habia articulo tengo que restarle la cantidad
    if (articulo.length !== 0) {
      //Lo que tendria que hacer es cambiar
      const index = carrito.products.findIndex(articulo => articulo.idProduct === idProduct);

      articulo[0].cantidad = parseInt(articulo[0].cantidad) - 1;

      if (articulo[0].cantidad === 0) {
        carrito.products.splice(index, 1);
      }
      else {
        carrito.products[index] = articulo[0];
      }

    }

    this.setState({ carrito: carrito });
  }

  //Number of elements es la cantidad de productos que hay en la base de datos
  traer_articulo(selected) {
    if (selected[0] !== undefined) {
      const articulo = selected[0];
      this.setState({ idProduct: articulo.id });
      this.setState({ name: articulo.name });
      this.setState({ color: articulo.color });
      this.setState({ size: articulo.size });
      this.setState({ leatherType: articulo.leatherType });
      this.setState({ gender: articulo.gender });
      this.setState({ shoeType: articulo.shoeType });
      this.setState({ price: articulo.price || 0 });
      this.setState({ cantidad: 0 });
      this.setState({ numberOfElements: articulo.numberOfElements });
    }

    console.log(selected);
  }

  resetState() {
    this.setState({ idProduct: "" });
    this.setState({ price: 0 });
    this.setState({ clientDni: "" });
    this.setState({ clientNameAndSurname: "" });
    this.setState({ numberOfElements: "" });
    this.setState({ cantidad: 0 });
    this.setState({ articulo: "" });
    this.setState({ name: "" })
    this.setState({ carrito: { products: [], clientInfo: { clientNameAndSurname: "", clientDni: "" } } });
  }

  componentDidMount() {
    this.bringArticles();
  }

  bringArticles() {
    axios
      .get("http://localhost:8080/api/public/product/get_products")
      .then((response) => {
        let res = response.data;
        res.forEach((element) => {
          element.gender = element.gender ? "Hombre" : "Dama";
          element.enFabrica = element.inFactory ? "En Fabrica" : "En Local";
        });

        this.setState({ products_typehead: res });
      })
      .catch((error) => console.log(error));
  }

  cambiar_id(event) {
    this.setState({ idProduct: event.target.value });
  }

  cambiar_price(event) {
    this.setState({ price: event.target.value });
  }
  cambiar_numberOfElements(event) {
    this.setState({ numberOfElements: event.target.value });
  }

  cambiar_cantidad(event) {
    this.setState({ cantidad: event.target.value });
  }

  cambiar_clientDni = (event) => {
    this.setState(prevState => ({
      carrito: {
        ...prevState.carrito,
        clientInfo: {
          ...prevState.carrito.clientInfo,
          clientDni: event.target.value
        }
      }
    }));
  };

  cambiar_clientNameAndSurname(event) {
    this.setState(prevState => ({
      carrito: {
        ...prevState.carrito,
        clientInfo: {
          ...prevState.carrito.clientInfo,
          clientNameAndSurname: event.target.value
        }
      }
    }));
  }

  cargar_factura() {
    //Se validan los products
    let validacion = "ok";

    this.state.carrito.products.forEach(product => {
      if (validarFormulario(product, true) !== "ok") {
        validacion = validarFormulario(product, true);
      }
    })

    if (validacion === "ok") {

      this.state.carrito.products.forEach(product => {
        product.clientNameAndSurname = this.state.carrito.clientInfo.clientNameAndSurname;
        product.clientDni = this.state.carrito.clientInfo.clientDni;
        product.numberOfElements = product.cantidad;
        product.emissionDate = new Date();
      })

      axios
        .post("http://localhost:8080/api/public/purchase/add_purchase", this.state.carrito.products)
        .then((response) => {
          if (response.data === "ok") {
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
                <div className="form-group col-12 mt-2 mt-md-0">
                  <label className="pb-2"> Nombre de Artículo </label>
                  <Typeahead
                    id="typeahead-products"
                    onChange={this.traer_articulo}
                    options={this.state.products_typehead.map(option => ({
                      ...option,
                      searchText: `${option.name} ${option.shoeType} ${option.leatherType} ${option.color} ${option.size} ${option.gender} ${option.enFabrica}`.toLowerCase(),
                    }))}
                    filterBy={(option, props) => {
                      const searchText = props.text.toLowerCase().trim(); // Normaliza el texto de búsqueda
                      const searchWords = searchText.split(" ").filter(word => word.length > 0);

                      // Usa la propiedad searchText preprocesada para el filtrado
                      return searchWords.every(word => option.searchText.includes(word));
                    }}
                    labelKey={(option) =>
                      `${option.name} ${option.shoeType} ${option.leatherType} ${option.color} ${option.size} ${option.gender} ${option.enFabrica}`
                    }
                  />
                </div>
              </div>

              <div className="row mt-3">
                <div className="form-group col-12 mt-2 mt-md-0 col-md-6">
                  <label className="pb-2"> DNI del Cliente (Opcional) </label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.carrito.clientInfo.clientDni}
                    onChange={this.cambiar_clientDni}
                  />
                </div>
                <div className="form-group col-12 mt-2 mt-md-0 col-md-6">
                  <label className="pb-2">
                    Nombre y Apellido del Cliente(Opcional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.carrito.clientInfo.clientNameAndSurname}
                    onChange={this.cambiar_clientNameAndSurname}
                  />
                </div>
              </div>

              <div className="row mt-3">
                <div className="form-group col-12 mt-2 mt-md-0 col-md-3">
                  <label className="pb-2"> Precio Por Unidad</label>
                  <input
                    type="number"
                    className="form-control"
                    value={this.state.price}
                    onChange={this.cambiar_price}
                    onFocus={(e) => {
                      if (this.state.price === 0) {
                        this.setState({ price: '' }); // Borra el 0 cuando se hace clic
                      }
                    }}
                  />
                </div>
                <div className="form-group col-12 mt-2 mt-md-0 col-md-3">
                  <label className="pb-2"> Quedan Disponibles:  </label>
                  <input
                    type="number"
                    className={`form-control ${this.state.numberOfElements <= 0 ? 'is-invalid' : ''}`}
                    readOnly
                    value={this.state.numberOfElements}
                  />
                  {this.state.numberOfElements <= 0 && (
                    <div className="invalid-feedback">Agotado</div>
                  )}
                </div>

                <div className="form-group col-12 mt-2 mt-md-0 col-md-3">
                  <label className="pb-2">Cantidad</label>
                  <input
                    type="number"
                    className={`form-control ${this.state.numberOfElements <= 0 ? 'is-invalid' : ''}`}
                    value={this.state.cantidad}
                    onChange={this.cambiar_cantidad} // Permite editar cuando no está bloqueado
                    onFocus={(e) => {
                      if (this.state.cantidad === 0 && this.state.numberOfElements > 0) {
                        // Solo borra el valor inicial si no está bloqueado
                        this.setState({ cantidad: '' });
                      }
                    }}
                    disabled={this.state.numberOfElements <= 0} // Bloquea el campo si no hay elementos
                  />
                  {this.state.numberOfElements <= 0 && (
                    <div className="invalid-feedback">Elemento bloqueado</div>
                  )}
                </div>


              </div>

              <div className="mt-3 d-flex w-100">

                <button
                  className="btn btn-primary me-2"
                  onClick={this.agregar_al_carrito}
                >
                  Agregar al Carrito
                </button>
                <QrReaderModule onArticleScanned={this.traer_articulo}></QrReaderModule>
              </div>
            </form>
          </div>
          <div className={`col-12 my-2 ${this.state.carrito.products.length > 0 ? 'd-block' : 'd-none'}`}>
            <div className="p-3 bg-white rounded">
              <h1>Carrito</h1>
              <Tableproducts carrito={this.state.carrito} restar={this.restar_articulo.bind(this)}
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
