import "./App.css";
import { Component } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Registrar from "./components/RegistrarVenta";
import Consultar from "./components/ConsultarVentas";
import Disponibilidad from "./components/DisponibilidadArticulo";
import AgregarArticulo from "./components/AgregarArticulo";
import ControlCatalogos from "./components/ControlCatalogos";

class App extends Component {
  render() {
    return (
      <div className="container-fluid">
        <Router>
          <header>
            <h1 className="main-title w-100 m-0">
              Palma Store Sistema de Gestión
            </h1>
          </header>

          <section>
            <div className="row m-0 w-100">
              <div className="main-buttons-container col-md-2 col-sm-12 justify-content-start">
                <div id="main-buttons" className="main-buttons d-flex justify-content-start  flex-md-column flex-sm-row">
                  <Link className="btn-main m-1" to={`/agregar_articulo`}>
                    Agregar al Stock del Local
                  </Link>
                  <Link className="btn-main m-1" to="/registrar">
                    Vender
                  </Link>
                  <Link className="btn-main m-1" to={`/`}>
                    Consultar Stock
                  </Link>
                  <Link className="btn-main m-1" to={`/consultar_ventas`}>
                    Consultar Ventas 
                  </Link>
                  <Link className="btn-main m-1" to={`/control_catalogos`}>
                    Cargar Catalogo Tienda Yes
                  </Link>
                </div>
              </div>
              <div className="explanation-text-main col-md-10 col-sm-12">
                <Routes>
                  <Route path="/registrar" element=<Registrar /> />
                  <Route path="/consultar_ventas" element=<Consultar /> />
                  <Route path="/agregar_articulo" element=<AgregarArticulo /> />
                  <Route path="/control_catalogos" element=<ControlCatalogos /> />
                  <Route path="/" element=<Disponibilidad /> />
                </Routes>
              </div>
            </div>
          </section>
          <footer>
            <p>
              Propiedad de Palma Store, sistema de uso personal y privado. <br />{" "}
              <br />
              Este sitio fue diseñado y desarrollado por Walter Ariel Baya
            </p>
            @Copyright{" "}
          </footer>
        </Router></div>
    );
  }
}

export default App;
