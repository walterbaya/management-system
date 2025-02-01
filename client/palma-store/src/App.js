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
      <div className="container-fluid p-0">



        <Router>
          <header className="custom-header">
            <div className="container py-4">
              <div className="d-flex align-items-center">
                <img
                  src={process.env.PUBLIC_URL + '/images/logo.png'}
                  alt="Logo Palma Store"
                  className="header-logo me-3"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://cdn-icons-png.flaticon.com/512/1067/1067583.png';
                  }}
                />
                <h1 className="main-title m-0">
                  <span className="highlight-text">PALMA STORE</span><br />
                  <small className="subtitle">Gestión Integral de Calzado</small>
                </h1>
              </div>
            </div>
          </header>

          <section className="main-content">
            <div className="row g-0 w-100">
              <div className="sidebar col-md-2 col-sm-12 p-3">
                <div className="d-flex flex-md-column flex-sm-row flex-wrap gap-2">
                  <Link className="btn btn-primary btn-action" to="/agregar_articulo">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-shoe-prints me-3 fs-5"></i>
                      <div className="text-start">
                        <div className="btn-main-text">Agregar Stock</div>
                        <small className="btn-sub-text">Nuevos modelos</small>
                      </div>
                    </div>
                  </Link>

                  <Link className="btn btn-success btn-action" to="/registrar">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-cash-register me-3 fs-5"></i>
                      <div className="text-start">
                        <div className="btn-main-text">Realizar Venta</div>
                        <small className="btn-sub-text">Registro rápido</small>
                      </div>
                    </div>
                  </Link>

                  <Link className="btn btn-info btn-action" to="/">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-boxes me-3 fs-5"></i>
                      <div className="text-start">
                        <div className="btn-main-text">Inventario</div>
                        <small className="btn-sub-text">Stock actual</small>
                      </div>
                    </div>
                  </Link>

                  <Link className="btn btn-warning btn-action" to="/consultar_ventas">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-chart-line me-3 fs-5"></i>
                      <div className="text-start">
                        <div className="btn-main-text">Reportes</div>
                        <small className="btn-sub-text">Estadísticas de ventas</small>
                      </div>
                    </div>
                  </Link>

                  <Link className="btn btn-secondary btn-action" to="/control_catalogos">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-book me-3 fs-5"></i>
                      <div className="text-start">
                        <div className="btn-main-text">Catálogos</div>
                        <small className="btn-sub-text">Gestión de productos</small>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="content-area col-md-10 col-sm-12 p-4">
                <Routes>
                  <Route path="/registrar" element={<Registrar />} />
                  <Route path="/consultar_ventas" element={<Consultar />} />
                  <Route path="/agregar_articulo" element={<AgregarArticulo />} />
                  <Route path="/control_catalogos" element={<ControlCatalogos />} />
                  <Route path="/" element={<Disponibilidad />} />
                </Routes>
              </div>
            </div>
          </section>

          <footer className="custom-footer">
            <div className="container text-center py-3">
              <p className="mb-1">
                Sistema de Gestión para Calzado - Propiedad de Palma Store
              </p>
              <small className="copyright-text">
                Desarrollado por Walter Ariel Baya © {new Date().getFullYear()}
              </small>
            </div>
          </footer>
        </Router>
      </div>
    );
  }
}

export default App;