import './App.css';
import { Component } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Registrar from './components/RegistrarVenta';


const router = createBrowserRouter([
  {
    path: "/registrar",
    element: <Registrar/>,
  },
]);



class App extends Component {
  render() {
    return (
      <div>
        <header>
          <h1 className="main-title w-100 m-0">Palma Store Sistema de Gestión</h1>
        </header>

        <section className="d-flex flex-row">
          <div className="main-buttons-container">
            <div id="main-buttons" className="main-buttons">
              <button className="btn-main my-1" >
                Consultar Disponibilidad de Artículo
              </button>
              <a className="btn-main my-1" href={`/registrar`}>
                Registrar Venta
              </a>
              <button className="btn-main my-1">
                Consultar Ventas
              </button>
            </div>
          </div>

          <div className="explanation-text-main">
            <RouterProvider router={router} />
          </div>
        </section>

        <footer>
          <p>Propiedad de Palma Store, sistema de uso personal y privado. <br /> <br />
            Este sitio fue diseñado y desarrollado por Walter Ariel Baya
          </p>
          @Copyright </footer>
      </div>
    )

      ;
  }
}

export default App;
