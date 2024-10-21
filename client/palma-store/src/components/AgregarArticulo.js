import { Component } from "react";
import LoadExcel from "./Utilities/LoadExcel";
import { Typeahead } from "react-bootstrap-typeahead"; // ES2015
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
      .get("http://localhost:8080/api/public/product/get_products")
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
      this.setState({ gender: articulo.gender});
      this.setState({ shoeType: articulo.shoeType });
      this.setState({ price: articulo.price });
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
      <div>
        {message}
        <form
          className="bg-white p-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <h1> Agregar Articulo / Modificar Articulo </h1>
          <select
            className="form-select w-25 my-4"
            aria-label="Default select example"
            value={this.state.editar_articulo}
            onChange={this.editar_articulo}
          >
            <option defaultValue value="agregar">
              Agregar articulo
            </option>
            <option value="editar">Editar articulo</option>
          </select>
          <div className="form-group row mt-3">
            <div className="form-group col-6">
              <label className="pb-2"> Nombre de Artículo </label>
              {(this.state.editar_articulo === "editar" && (
                <Typeahead
                  id="typeahead-articulos"
                  onInputChange={(text) => {
                    this.setState({ name: text });
                  }}
                  onChange={this.traer_articulo}
                  options={this.state.articulos_typehead}
                  filterBy={[
                    "name",
                    "shoeType",
                    "leatherType",
                    "color",
                    "size",
                    "gender"
                  ]}
                  labelKey={(option) =>
                    `${option.name} ${option.shoeType} ${option.leatherType} ${option.color} ${option.size} ${option.gender}`
                  }
                />
              )) ||
                (this.state.editar_articulo === "agregar" && (
                  <input
                    type="text"
                    className="form-control col-6"
                    onChange={(event) => {
                      this.setState({ name: event.target.value });
                    }}
                  />
                ))}
            </div>
            <div className="col-6">
              <label className="pb-2"> Genero </label>

              <select
                className="form-select"
                aria-label="Default select example"
                value={this.state.gender}
                onChange={this.cambiar_gender}
              >
                <option defaultValue value="Mujer">
                  Mujer
                </option>
                <option value="Hombre">Hombre</option>
              </select>
            </div>
          </div>
          <div className="row align-items-center mt-3">
            <div className="col-4">
              <label className="pb-2"> Tipo </label>
              <input
                type="text"
                className="form-control"
                value={this.state.shoeType}
                onChange={this.cambiar_shoeType}
              />
            </div>
            <div className="col-4">
              <label className="pb-2"> Color </label>
              <input
                type="text"
                className="form-control"
                value={this.state.color}
                onChange={this.cambiar_color}
              />
            </div>
            <div className="col-4">
              <label className="pb-2"> Cuero </label>
              <input
                type="text"
                className="form-control"
                value={this.state.leatherType}
                onChange={this.cambiar_leatherType}
              />
            </div>
          </div>
          <div className="row align-items-center mt-3">
            <div className="col-4">
              <label className="pb-2"> Cantidad </label>
              <input
                type="number"
                className="form-control"
                value={this.state.numberOfElements}
                onChange={this.cambiar_numberOfElements}
              />
            </div>

            <div className="col-4">
              <label className="pb-2"> Talle </label>
              <input
                type="number"
                className="form-control"
                value={this.state.size}
                onChange={this.cambiar_size}
              />
            </div>
            <div className="col-4">
              <label className="pb-2"> Precio </label>
              <input
                type="number"
                className="form-control"
                value={this.state.price}
                onChange={this.cambiar_price}
              />
            </div>
          </div>
          <div className="form-group mt-3 d-flex">
            <button
              className="btn btn-primary mt-3"
              onClick={this.enviar_formulario}
            >
              Agregar Artículo
            </button>
            <div className="mt-3 ms-3">
              <LoadExcel />
            </div>
            <div className="mt-3 ms-3">
              <QrReaderModule></QrReaderModule>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default AgregarArticulo;
