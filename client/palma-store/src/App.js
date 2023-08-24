import "./App.css";
import { Component } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Registrar from "./components/RegistrarVenta";
import Consultar from "./components/ConsultarVentas";
import Disponibilidad from "./components/DisponibilidadArticulo";
import AgregarArticulo from "./components/AgregarArticulo";

class App extends Component {
  render() {
    return (
      <Router>
        <header>
          <h1 className="main-title w-100 m-0">
            Palma Store Sistema de Gestión
          </h1>
        </header>

        <section className="d-flex flex-row">
          <div className="main-buttons-container">
            <div id="main-buttons" className="main-buttons">
              <Link className="btn-main my-1" to={`/agregar_articulo`}>
                Agregar Articulo Modificar Articulo
              </Link>
              <Link className="btn-main my-1" to="/registrar">
                Registrar Venta
              </Link>
              <Link className="btn-main my-1" to={`/`}>
                Consultar Stock
              </Link>
              <Link className="btn-main my-1" to={`/consultar_ventas`}>
                Consultar Ventas
              </Link>
            </div>
          </div>
          <div className="explanation-text-main">
            <Routes>
              <Route path="/registrar" element=<Registrar /> />
              <Route path="/consultar_ventas" element=<Consultar /> />
              <Route path="/agregar_articulo" element=<AgregarArticulo /> />
              <Route path="/" element=<Disponibilidad /> />
            </Routes>
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
      </Router>
    );
  }
}

export default App;
