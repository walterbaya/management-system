import "./AgregarArticulo.css";
import { Component } from "react";
import LoadExcel from "./Utilities/LoadExcel";
import { Typeahead } from "react-bootstrap-typeahead";
import QrReaderModule from "./Utilities/QrReaderModule";
import axios from "axios";

function validarFormulario(factura) {
  if (!factura.name) {
    return "Error, se debe ingresar el nombre del articulo";
  }
  if (!factura.numberOfElements || factura.numberOfElements <= 0) {
    return "Error, se debe ingresar la cantidad y debe ser mayor a 0";
  }
  if (!factura.size || factura.size <= 0) {
    return "Error, se debe ingresar el size y debe ser mayor a 0";
  }
  if (!factura.color) {
    return "Error, se debe ingresar el color ";
  }

  return "ok";
}

class AgregarArticulo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      color: "",
      numberOfElements: 0,
      size: 0,
      error: "",
      exito: "",
      leatherType: "",
      gender: "Mujer",
      shoeType: "",
      price: 0,
      articulos_typehead: [],
      editar_articulo: "agregar",
      isSubmitting: false,
      formValidations: {
        name: true,
        size: true,
        color: true,
        // ... otras validaciones
      }
    };

    this.enviar_formulario = this.enviar_formulario.bind(this);
    this.cambiar_name = this.cambiar_name.bind(this);
    this.cambiar_size = this.cambiar_size.bind(this);
    this.cambiar_numberOfElements = this.cambiar_numberOfElements.bind(this);
    this.cambiar_color = this.cambiar_color.bind(this);
    this.cambiar_leatherType = this.cambiar_leatherType.bind(this);
    this.cambiar_gender = this.cambiar_gender.bind(this);
    this.cambiar_shoeType = this.cambiar_shoeType.bind(this);
    this.cambiar_price = this.cambiar_price.bind(this);
    this.traer_articulo = this.traer_articulo.bind(this);
    this.editar_articulo = this.editar_articulo.bind(this);
  }

  editar_articulo(event) {
    this.setState({ editar_articulo: event.target.value });
    this.reset_state();
  }

  cambiar_name(event) {
    this.setState({ name: event.target.value });
  }

  cambiar_color(event) {
    this.setState({ color: event.target.value });
  }

  cambiar_size(event) {
    this.setState({ size: event.target.value });
  }

  cambiar_numberOfElements(event) {
    this.setState({ numberOfElements: event.target.value });
  }

  cambiar_leatherType(event) {
    this.setState({ leatherType: event.target.value });
  }

  cambiar_shoeType(event) {
    this.setState({ shoeType: event.target.value });
  }

  cambiar_gender(event) {
    this.setState({ gender: event.target.value });
  }

  cambiar_price(event) {
    this.setState({ price: event.target.value });
  }

  componentDidMount() {
    axios
      .get("http://localhost:8080/api/public/product/get_products_not_in_factory")
      .then((response) => {
        console.log(response.data)
        let res = response.data;
        res.forEach(element => {
          element.gender = element.gender ? "Mujer" : "Hombre";
        });

        this.setState({ articulos_typehead: res });

      })
      .catch((error) => console.log(error));
  }

  reset_state() {
    this.setState({ id: "" });
    this.setState({ name: "" });
    this.setState({ color: "" });
    this.setState({ numberOfElements: 0 });
    this.setState({ size: 0 });
    this.setState({ leatherType: "" });
    this.setState({ gender: "Mujer" });
    this.setState({ shoeType: "" });
    this.setState({ price: 0 });
  }

  enviar_formulario() {
    const factura = {
      id: this.state.id,
      name: this.state.name,
      size: this.state.size,
      numberOfElements: this.state.numberOfElements,
      color: this.state.color,
      exito: this.state.exito,
      leatherType: this.state.leatherType,
      gender: this.state.gender === "Mujer",
      shoeType: this.state.shoeType,
      price: this.state.price,
    };

    const validacion = validarFormulario(factura);


    if (validacion === "ok") {

      this.setState({ isSubmitting: true });

      axios
        .post("http://localhost:8080/api/public/product/add_product", factura)
        .then((response) => {
          console.log(response.data);
          this.setState({ exito: "Articulo guardado con exito" });
          axios
            .get("http://localhost:8080/api/public/product/get_products")
            .then((response) => {
              this.setState({ articulos_typehead: response.data });
              this.reset_state();
              this.setState({ isSubmitting: false });
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    } else {
      this.setState({ error: validacion });
    }
  }

  traer_articulo(selected) {
    if (selected[0] !== undefined) {
      const articulo = selected[0];
      this.setState({ id: articulo.id });
      this.setState({ name: articulo.name });
      this.setState({ color: articulo.color });
      this.setState({ numberOfElements: articulo.numberOfElements });
      this.setState({ size: articulo.size });
      this.setState({ leatherType: articulo.leatherType });
      this.setState({ gender: articulo.gender });
      this.setState({ shoeType: articulo.shoeType });
      this.setState({ price: articulo.price });

      axios
        .post("http://localhost:8080/api/public/product/add_product", articulo)
        .then((response) => {
          console.log("datos:");
          articulo = response.data[0];
          console.log(articulo.cantidad);
          articulo.cantidad = articulo.cantidad + 1;
        })
        .catch((error) => console.log(error));
    }


  }

  render() {
    let message = <div></div>;
    if (this.state.error) {
      message = (
        <div className="alert alert-warning shadow-sm" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {this.state.error}
        </div>
      );
    }

    if (this.state.exito) {
      message = (
        <div className="alert alert-success shadow-sm" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          {this.state.exito}
        </div>
      );
    }

    return (
      <div className="container-fluid p-4">
        <div className="card shadow border-0">
          <div className="card-header bg-primary text-white">
            <h2 className="mb-0">
              <i className="fas fa-shoe-prints me-2"></i>
              Gestión de Artículos
            </h2>
            <small>Agregar/Modificar artículos en stock</small>
          </div>

          <div className="card-body">
            {message}

            <div className="mb-4">
              <select
                className="form-select form-select-lg w-25"
                value={this.state.editar_articulo}
                onChange={this.editar_articulo}
              >
                <option value="agregar">Agregar artículo</option>
                <option value="editar">Editar artículo</option>
              </select>
            </div>

            <div className="row g-4">
              {/* Columna Izquierda */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-bold">Nombre del Artículo</label>
                  {this.state.editar_articulo === "editar" ? (
                    <Typeahead
                      id="typeahead-articulos"
                      className="typeahead-custom"
                      onInputChange={(text) => this.setState({ name: text })}
                      onChange={this.traer_articulo}
                      options={this.state.articulos_typehead}
                      filterBy={(option, props) => {
                        const searchText = props.text.toLowerCase();
                        const searchWords = searchText.split(" ").filter(word => word.length > 0);
                        const optionText = `${option.name} ${option.shoeType} ${option.leatherType} ${option.color} ${option.size} ${option.gender}`.toLowerCase();
                        return searchWords.every(word => optionText.includes(word));
                      }}
                      labelKey={(option) =>
                        `${option.name} ${option.shoeType} ${option.leatherType} ${option.color} ${option.size}`
                      }

                    />
                  ) : (
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={this.state.name}
                      onChange={(e) => this.setState({ name: e.target.value })}
                    />
                  )}
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Género</label>
                    <select
                      className="form-select form-select-lg"
                      value={this.state.gender}
                      onChange={this.cambiar_gender}
                    >
                      <option value="Mujer">Mujer</option>
                      <option value="Hombre">Hombre</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Tipo de Calzado</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={this.state.shoeType}
                      onChange={this.cambiar_shoeType}
                    />
                  </div>
                </div>
              </div>

              {/* Columna Derecha */}
              <div className="col-md-6">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Color</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={this.state.color}
                      onChange={this.cambiar_color}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Tipo de Cuero</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={this.state.leatherType}
                      onChange={this.cambiar_leatherType}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-bold">Cantidad</label>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      value={this.state.numberOfElements}
                      onChange={this.cambiar_numberOfElements}
                    />

                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-bold">Talle</label>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      value={this.state.size}
                      onChange={this.cambiar_size}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-bold">Precio</label>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      value={this.state.price}
                      onChange={this.cambiar_price}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-3 mt-4">
              <button
                className={`btn btn-primary btn-lg ${this.state.isSubmitting ? 'btn-save' : ''}`}
                onClick={this.enviar_formulario}
                disabled={this.state.isSubmitting}
              >
                {this.state.isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    Guardar Artículo
                  </>
                )}
              </button>

              <LoadExcel className="btn btn-secondary btn-lg" />
              <QrReaderModule
                className="btn btn-info btn-lg"
                onArticleScanned={this.traer_articulo}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AgregarArticulo;
