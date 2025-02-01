import { Component } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { Table, Button, Alert, Form, Row, Col } from "react-bootstrap";
import QrReaderModule from "./Utilities/QrReaderModule";
import axios from "axios";
import "./Registrar.css";

function validarFormulario(articulo, esArticulo) {
  const errors = {};

  if (esArticulo && parseInt(articulo.numberOfElements) < parseInt(articulo.cantidad)) {
    errors.stock = `Stock insuficiente de ${articulo.name}`;
  }

  if (!articulo.name) errors.nombre = "Nombre del artículo requerido";
  if (!articulo.price || articulo.price <= 0) errors.precio = "Precio inválido";
  if (!articulo.cantidad || articulo.cantidad <= 0) errors.cantidad = "Cantidad inválida";

  return Object.keys(errors).length === 0 ? "ok" : errors;
}

class Registrar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      exito: null,
      idProduct: "",
      price: "",
      cantidad: "",
      name: "",
      size: "",
      color: "",
      leatherType: "",
      shoeType: "",
      numberOfElements: 0,
      carrito: {
        products: [],
        clientInfo: {
          clientNameAndSurname: "",
          clientDni: ""
        }
      },
      products_typehead: [],
      isSubmitting: false
    };

    // Binding de métodos
    this.cargar_factura = this.cargar_factura.bind(this);
    this.agregar_al_carrito = this.agregar_al_carrito.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.restar_articulo = this.restar_articulo.bind(this);
    this.traer_articulo = this.traer_articulo.bind(this);
  }

  componentDidMount() {
    this.cargarProductos();
  }

  cargarProductos() {
    axios.get("http://localhost:8080/api/public/product/get_products")
      .then(response => {
        const productos = response.data.map(p => ({
          ...p,
          gender: p.gender ? "Hombre" : "Dama",
          enFabrica: p.inFactory ? "En Fabrica" : "En Local"
        }));
        this.setState({ products_typehead: productos });
      })
      .catch(error => console.error("Error cargando productos:", error));
  }

  traer_articulo(selected) {
    if (selected.length > 0) {
      const articulo = selected[0];
      this.setState({
        idProduct: articulo.id,
        name: articulo.name,
        color: articulo.color,
        size: articulo.size,
        leatherType: articulo.leatherType,
        shoeType: articulo.shoeType,
        price: articulo.price || "",
        numberOfElements: articulo.numberOfElements,
        cantidad: ""
      });
      console.log(selected);
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = name === "cantidad" || name === "price"
      ? parseFloat(value) || 0
      : value;

    if (name === "clientDni" || name === "clientNameAndSurname") {
      this.setState(prevState => ({
        carrito: {
          ...prevState.carrito,
          clientInfo: {
            ...prevState.carrito.clientInfo,
            [name]: value
          }
        }
      }));
    } else {
      this.setState({ [name]: value });
    }
  }

  agregar_al_carrito() {
    const { idProduct, name, size, color, leatherType, shoeType, price, cantidad, numberOfElements } = this.state;

    const nuevoArticulo = {
      idProduct,
      name,
      size,
      color,
      leatherType,
      shoeType,
      price: parseFloat(price),
      cantidad: parseInt(cantidad),
      numberOfElements: parseInt(numberOfElements)
    };

    const validacion = validarFormulario(nuevoArticulo, true);

    if (validacion === "ok") {
      this.setState(prevState => ({
        carrito: {
          ...prevState.carrito,
          products: [...prevState.carrito.products, nuevoArticulo]
        },
        error: null
      }), () => {
        this.setState({
          idProduct: "",
          price: "",
          cantidad: "",
          name: "",
          size: "",
          color: "",
          leatherType: "",
          shoeType: "",
          numberOfElements: 0
        });
      });
    } else {
      this.setState({ error: validacion });
    }
  }

  eliminar(idProduct) {
    this.setState(prevState => ({
      carrito: {
        ...prevState.carrito,
        products: prevState.carrito.products.filter(item => item.idProduct !== idProduct)
      }
    }));
  }

  restar_articulo(idProduct) {
    this.setState(prevState => {
      const updatedProducts = prevState.carrito.products.map(item => {
        if (item.idProduct === idProduct) {
          return {
            ...item,
            cantidad: item.cantidad - 1
          };
        }
        return item;
      }).filter(item => item.cantidad > 0);

      return {
        carrito: {
          ...prevState.carrito,
          products: updatedProducts
        }
      };
    });
  }

  async cargar_factura() {
    const { carrito } = this.state;

    try {
      this.setState({ isSubmitting: true });

      const facturaData = {
        clientInfo: carrito.clientInfo,
        products: carrito.products.map(product => ({
          productId: product.idProduct,
          quantity: product.cantidad,
          price: product.price
        }))
      };

      const response = await axios.post(
        "http://localhost:8080/api/public/purchase/add_purchase",
        facturaData
      );

      if (response.status === 200) {
        this.setState({
          exito: "Venta registrada exitosamente!",
          error: null,
          carrito: {
            products: [],
            clientInfo: { clientNameAndSurname: "", clientDni: "" }
          }
        });
        this.cargarProductos();
      }
    } catch (error) {
      console.error("Error al cargar factura:", error);
      this.setState({
        error: "Error al procesar la venta. Verifique los datos.",
        exito: null
      });
    } finally {
      this.setState({ isSubmitting: false });
    }
  }

  render() {
    const { error, exito, isSubmitting, carrito, products_typehead } = this.state;
    const totalVenta = carrito.products.reduce((sum, item) => sum + (item.price * item.cantidad), 0);

    return (
      <div className="container-fluid p-4">
        <div className="card shadow-lg">
          <div className="card-header bg-primary text-white">
            <h2 className="mb-0">
              <i className="fas fa-cash-register me-2"></i>
              Registrar Venta
            </h2>
          </div>

          <div className="card-body">
            {error && (
              <Alert variant="danger" className="animate__animated animate__headShake">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {Object.values(error).join(", ")}
              </Alert>
            )}

            {exito && (
              <Alert variant="success">
                <i className="fas fa-check-circle me-2"></i>
                {exito}
              </Alert>
            )}

            <Form onSubmit={e => e.preventDefault()}>
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Label>Buscar Artículo</Form.Label>
                  <Typeahead
                    id="busqueda-articulos"
                    placeholder="Escribe para buscar..."
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
                </Col>
              </Row>

              <Row className="g-3 mb-4">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Precio Unitario</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={this.state.price}
                      onChange={this.handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control
                      type="number"
                      name="cantidad"
                      value={this.state.cantidad}
                      onChange={(e) => {
                        let value = Math.min(
                          Math.max(parseInt(e.target.value) || 1, 1), // Valor mínimo 1
                          this.state.numberOfElements // Valor máximo según stock
                        );
                        this.handleChange({
                          target: {
                            name: "cantidad",
                            value: value
                          }
                        });
                      }}
                      min="1"
                      max={this.state.numberOfElements}
                      required
                    />
                    <Form.Text>
                      Disponibles: {this.state.numberOfElements}
                    </Form.Text>
                  </Form.Group>
                </Col>

                <Col md={4} className="d-flex align-items-center mt-4">
                  <Button
                    variant="primary"
                    onClick={this.agregar_al_carrito}
                    disabled={!this.state.idProduct}
                  >
                    <i className="fas fa-cart-plus me-2"></i>
                    Agregar al Carrito
                  </Button>
                </Col>
              </Row>

              <Row className="g-3 mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>DNI del Cliente</Form.Label>
                    <Form.Control
                      type="text"
                      name="clientDni"
                      value={carrito.clientInfo.clientDni}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Nombre del Cliente</Form.Label>
                    <Form.Control
                      type="text"
                      name="clientNameAndSurname"
                      value={carrito.clientInfo.clientNameAndSurname}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {carrito.products.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-3">
                    <i className="fas fa-shopping-cart me-2"></i>
                    Detalle de la Venta
                  </h4>

                  <Table striped bordered hover>
                    <thead className="bg-light">
                      <tr>
                        <th>Artículo</th>
                        <th>Talle</th>
                        <th>Color</th>
                        <th>Precio Unit.</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carrito.products.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.size}</td>
                          <td>{item.color}</td>
                          <td>${item.price}</td>
                          <td>{item.cantidad}</td>
                          <td>${(item.price * item.cantidad).toFixed(2)}</td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => this.eliminar(item.idProduct)}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <h4 className="mb-0">
                      Total: ${totalVenta.toFixed(2)}
                    </h4>
                    <Button
                      variant="success"
                      size="lg"
                      onClick={this.cargar_factura}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check-circle me-2"></i>
                          Finalizar Venta
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Registrar;
