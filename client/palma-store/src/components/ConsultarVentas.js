import {Component} from "react";
import axios from "axios";


function validarFormulario(consulta) {
    if (!consulta.fecha_desde) {
      return "Error, se debe ingresar una fecha desde";
    }
    if (!consulta.fecha_hasta) {
      return "Error, se debe ingresar una fecha hasta";
    }
    if (!consulta.fecha_desde > consulta.fecha_hasta) {
      return "Error, fecha hasta tiene que ser superior o igual a fecha desde.";
    }
  
    return "ok";
  }

class Consultar extends Component{
    constructor(props){
        super(props);
        this.state = {
            fecha_hasta: "",
            fecha_desde: ""
        }
        this.cambiar_fecha_desde = this.cambiar_fecha_desde.bind(this);
        this.cambiar_fecha_hasta = this.cambiar_fecha_hasta.bind(this);
    }

    cambiar_fecha_desde(event) {
        this.setState({ fecha_desde: event.target.value });
    }
    cambiar_fecha_hasta(event) {
        this.setState({ fecha_hasta: event.target.value });
    }

    obtener_excel() {
        const consulta = {
          fecha_desde: this.state.fecha_desde,
          fecha_hasta: this.state.fecha_hasta,
        };
    
        const validacion = validarFormulario(consulta);
    
        if (validacion === "ok") {
          axios
            .post("http://localhost:3000/obtener_excel", consulta)
            .then((response) => console.log(response.data))
            .catch((error) => console.log(error));
        } else {
          this.setState({ error: validacion });
        }
      }
      

    enviar_formulario() {
        const consulta = {
          fecha_desde: this.state.fecha_desde,
          fecha_hasta: this.state.fecha_hasta,
        };
    
        const validacion = validarFormulario(consulta);
    
        if (validacion === "ok") {
          axios
            .post("http://localhost:3000/consulta_facturas", consulta)
            .then((response) => console.log(response.data))
            .catch((error) => console.log(error));
        } else {
          this.setState({ error: validacion });
        }
      }
      

    render(){
        return(
            <div>       
            <form
              className="bg-white p-4 h-100"
              onSubmit={(event) => event.preventDefault()}
            >
              <h1>Consultar Ventas</h1>
              <div className="form-group mt-3">
                <label className="pb-2">Fecha Desde</label>
                <input
                  type="date"
                  className="form-control"
                  value={this.state.fecha_desde}
                  onChange={this.cambiar_fecha_desde}
                />
              </div>
              <div className="form-group mt-3">
                <label className="pb-2">Fecha Hasta</label>
                <input
                  type="date"
                  className="form-control"
                  value={this.state.fecha_hasta}
                  onChange={this.cambiar_fecha_hasta}
                />
              </div>
              <button
                className="btn btn-primary mt-3"
                onClick={this.enviar_formulario}
              >
                Obtener Ventas Registradas
              </button>
              <button
                className="btn btn-success mt-3 mx-3"
                onClick={this.obtener_excel}
              >
                Obtener Excel
              </button>
            </form>
          </div>
        );
    }
}

export default Consultar;