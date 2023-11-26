import { Component } from "react";
import LoadExcel from "./Utilities/LoadExcel";
import { Typeahead } from "react-bootstrap-typeahead"; // ES2015
import axios from "axios";

function validarFormulario(factura) {
  if (!factura.nombre_articulo) {
    return "Error, se debe ingresar el nombre del articulo";
  }
  if (!factura.cantidad || factura.cantidad <= 0) {
    return "Error, se debe ingresar la cantidad y debe ser mayor a 0";
  }
  if (!factura.talle || factura.talle <= 0) {
    return "Error, se debe ingresar el talle y debe ser mayor a 0";
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
      nombre_articulo: "",
      color: "",
      cantidad: 0,
      talle: 0,
      error: "",
      exito: "",
      cuero: "",
      genero: "Mujer",
      tipo: "",
      precio: 0,
      articulos_typehead: [],
      editar_articulo: "agregar",
    };

    this.enviar_formulario = this.enviar_formulario.bind(this);
    this.cambiar_nombre_articulo = this.cambiar_nombre_articulo.bind(this);
    this.cambiar_talle = this.cambiar_talle.bind(this);
    this.cambiar_cantidad = this.cambiar_cantidad.bind(this);
    this.cambiar_color = this.cambiar_color.bind(this);
    this.cambiar_cuero = this.cambiar_cuero.bind(this);
    this.cambiar_genero = this.cambiar_genero.bind(this);
    this.cambiar_tipo = this.cambiar_tipo.bind(this);
    this.cambiar_precio = this.cambiar_precio.bind(this);
    this.traer_articulo = this.traer_articulo.bind(this);
    this.editar_articulo = this.editar_articulo.bind(this);
  }

  editar_articulo(event) {
    this.setState({ editar_articulo: event.target.value });
    this.reset_state();
  }

  cambiar_nombre_articulo(event) {
    this.setState({ nombre_articulo: event.target.value });
  }

  cambiar_color(event) {
    this.setState({ color: event.target.value });
  }

  cambiar_talle(event) {
    this.setState({ talle: event.target.value });
  }
  cambiar_cantidad(event) {
    this.setState({ cantidad: event.target.value });
  }

  cambiar_cuero(event) {
    this.setState({ cuero: event.target.value });
  }

  cambiar_tipo(event) {
    this.setState({ tipo: event.target.value });
  }

  cambiar_genero(event) {
    this.setState({ genero: event.target.value });
  }

  cambiar_precio(event) {
    this.setState({ precio: event.target.value });
  }

  componentDidMount() {
    axios
      .get("http://localhost:3000/get_articulos")
      .then((response) => {
        let res = response.data;
        res.forEach(element => {
          element.genero = element.genero ? "Mujer" : "Hombre";
        });

        this.setState({ articulos_typehead: res });

      })
      .catch((error) => console.log(error));
  }

  reset_state() {
    this.setState({ id: "" });
    this.setState({ nombre_articulo: "" });
    this.setState({ color: "" });
    this.setState({ cantidad: 0 });
    this.setState({ talle: 0 });
    this.setState({ cuero: "" });
    this.setState({ genero: "Mujer" });
    this.setState({ tipo: "" });
    this.setState({ precio: 0 });
  }

  enviar_formulario() {
    const factura = {
      id: this.state.id,
      nombre_articulo: this.state.nombre_articulo,
      talle: this.state.talle,
      cantidad: this.state.cantidad,
      color: this.state.color,
      exito: this.state.exito,
      cuero: this.state.cuero,
      genero: this.state.genero === "Mujer",
      tipo: this.state.tipo,
      precio: this.state.precio,
    };

    console.log(factura);

    const validacion = validarFormulario(factura);

    if (validacion === "ok") {
      axios
        .post("http://localhost:3000/agregar_articulo", factura)
        .then((response) => {
          console.log(response.data);
          this.setState({ exito: "Articulo guardado con exito" });
          axios
            .get("http://localhost:3000/get_articulos")
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
      this.setState({ nombre_articulo: articulo.nombre_articulo });
      this.setState({ color: articulo.color });
      this.setState({ cantidad: articulo.cantidad });
      this.setState({ talle: articulo.talle });
      this.setState({ cuero: articulo.cuero });
      this.setState({ genero: articulo.genero});
      this.setState({ tipo: articulo.tipo });
      this.setState({ precio: articulo.precio });
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
                    this.setState({ nombre_articulo: text });
                  }}
                  onChange={this.traer_articulo}
                  options={this.state.articulos_typehead}
                  filterBy={[
                    "nombre_articulo",
                    "tipo",
                    "cuero",
                    "color",
                    "talle",
                    "genero"
                  ]}
                  labelKey={(option) =>
                    `${option.nombre_articulo} ${option.tipo} ${option.cuero} ${option.color} ${option.talle} ${option.genero}`
                  }
                />
              )) ||
                (this.state.editar_articulo === "agregar" && (
                  <input
                    type="text"
                    className="form-control col-6"
                    onChange={(event) => {
                      this.setState({ nombre_articulo: event.target.value });
                    }}
                  />
                ))}
            </div>
            <div className="col-6">
              <label className="pb-2"> Genero </label>

              <select
                className="form-select"
                aria-label="Default select example"
                value={this.state.genero}
                onChange={this.cambiar_genero}
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
                value={this.state.tipo}
                onChange={this.cambiar_tipo}
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
                value={this.state.cuero}
                onChange={this.cambiar_cuero}
              />
            </div>
          </div>
          <div className="row align-items-center mt-3">
            <div className="col-4">
              <label className="pb-2"> Cantidad </label>
              <input
                type="number"
                className="form-control"
                value={this.state.cantidad}
                onChange={this.cambiar_cantidad}
              />
            </div>

            <div className="col-4">
              <label className="pb-2"> Talle </label>
              <input
                type="number"
                className="form-control"
                value={this.state.talle}
                onChange={this.cambiar_talle}
              />
            </div>
            <div className="col-4">
              <label className="pb-2"> Precio </label>
              <input
                type="number"
                className="form-control"
                value={this.state.precio}
                onChange={this.cambiar_precio}
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
          </div>
        </form>
      </div>
    );
  }
}

export default AgregarArticulo;
