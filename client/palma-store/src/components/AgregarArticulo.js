import { Component } from "react";
import LoadExcel from "./Utilities/LoadExcel";
const axios = require("axios");


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
            nombre_articulo: "",
            color: "",
            cantidad: 0,
            talle: 0,
            error: "",
            exito: "",
        };

        this.enviar_formulario = this.enviar_formulario.bind(this);
        this.cambiar_nombre_articulo = this.cambiar_nombre_articulo.bind(this);
        this.cambiar_talle = this.cambiar_talle.bind(this);
        this.cambiar_cantidad = this.cambiar_cantidad.bind(this);
        this.cambiar_color = this.cambiar_color.bind(this);
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


    enviar_formulario() {
        const factura = {
            nombre_articulo: this.state.nombre_articulo,
            talle: this.state.talle,
            cantidad: this.state.cantidad,
            color: this.state.color
        };

        const validacion = validarFormulario(factura);

        if (validacion === "ok") {
            axios
                .post("http://localhost:3000/agregar_articulo", factura)
                .then((response) => {
                        console.log(response.data);
                        this.setState({exito: "Articulo guardado con exito"})
                    }

                )
                .catch((error) => console.log(error));
        } else {
            this.setState({ error: validacion });
        }
    }

    render() {
        let message = < div > < /div>;
        if (this.state.error) {
            message = < div className = "alert alert-warning"
            role = "alert" > { this.state.error } < /div>;
        }

        if (this.state.exito) {
            message = < div className = "alert alert-success"
            role = "alert" > { this.state.exito } < /div>;
        }

        return ( <
            div > { message } <
            form className = "bg-white p-4 h-100"
            onSubmit = {
                (event) => event.preventDefault()
            } >
            <
            h1 > Agregar Articulo < /h1>  <
            div className = "form-group mt-3" >
            <
            label className = "pb-2" > Nombre de Artículo < /label> <
            input type = "text"
            className = "form-control"
            value = { this.state.nombre_articulo }
            onChange = { this.cambiar_nombre_articulo }
            /> < /
            div > <
            div className = "form-group mt-3" >
            <
            label className = "pb-2" > Talle < /label> <
            input type = "number"
            className = "form-control"
            value = { this.state.talle }
            onChange = { this.cambiar_talle }
            /> < /
            div >

            <
            div className = "form-group mt-3" >
            <
            label className = "pb-2" > Cantidad < /label>  <
            input type = "number"
            className = "form-control"
            value = { this.state.cantidad }
            onChange = { this.cambiar_cantidad }
            />  < /
            div >




            <div className = "form-group mt-3" >
                <label className = "pb-2" > Color < /label> 
                <input type = "text" className = "form-control" value = { this.state.color } onChange = { this.cambiar_color }/> 
                </div>
                <button className = "btn btn-primary mt-3" onClick = { this.enviar_formulario } >Agregar Artículo </button>
                <button type="button" className="btn btn-primary mt-3 mx-3" data-bs-toggle="modal" data-bs-target="#loadExcel">
                Cargar Excel con Artículos</button>
            </form >

            <LoadExcel/>
             
            </div>
        );
    }
}

export default AgregarArticulo;