import { Component } from "react";
const axios = require("axios");

function validarFormulario(factura) {
    if (!factura.nombre_articulo_cliente) {
        return "Error, se debe ingresar el nombre del articulo";
    }
    if (!factura.precio_venta || factura.precio_venta <= 0) {
        return "Error, se debe ingresar el precio de venta y debe ser mayor o igual a 0";
    }
    if (!factura.dni_cliente) {
        return "Error, se debe ingresar el dni del cliente";
    }
    if (!factura.nombre_y_apellido_cliente) {
        return "Error, se debe ingresar el nombre y apellido del cliente";
    }

    return "ok";
}

class Registrar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nombre_articulo: "",
            precio: 0,
            dni_cliente: "",
            nombre_apellido: "",
            error: "",
        };

        this.enviar_formulario = this.enviar_formulario.bind(this);
        this.cambiar_nombre_articulo = this.cambiar_nombre_articulo.bind(this);
        this.cambiar_precio = this.cambiar_precio.bind(this);
        this.cambiar_dni_cliente = this.cambiar_dni_cliente.bind(this);
        this.cambiar_nombre_apellido = this.cambiar_nombre_apellido.bind(this);
    }

    cambiar_nombre_articulo(event) {
        this.setState({ nombre_articulo: event.target.value });
    }

    cambiar_precio(event) {
        this.setState({ precio: event.target.value });
    }

    cambiar_dni_cliente(event) {
        this.setState({ dni_cliente: event.target.value });
    }

    cambiar_nombre_apellido(event) {
        this.setState({ nombre_apellido: event.target.value });
    }

    enviar_formulario() {
        const factura = {
            nombre_articulo_cliente: this.state.nombre_articulo,
            precio_venta: this.state.precio,
            dni_cliente: this.state.dni_cliente,
            nombre_y_apellido_cliente: this.state.nombre_apellido,
        };

        const validacion = validarFormulario(factura);

        if (validacion === "ok") {
            axios
                .post("http://localhost:3000/guardar_factura", factura)
                .then((response) => console.log(response.data))
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

        return ( <
            div > { message } <
            form className = "bg-white p-4 h-100"
            onSubmit = {
                (event) => event.preventDefault()
            } >
            <
            h1 > Registrar Factura < /h1> <
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
            label className = "pb-2" > Precio < /label> <
            input type = "number"
            className = "form-control"
            value = { this.state.precio }
            onChange = { this.cambiar_precio }
            /> < /
            div > <
            div className = "form-group mt-3" >
            <
            label className = "pb-2" > DNI Cliente < /label> <
            input type = "text"
            className = "form-control"
            value = { this.state.dni_cliente }
            onChange = { this.cambiar_dni_cliente }
            /> < /
            div > <
            div className = "form-group mt-3" >
            <
            label className = "pb-2" > Nombre y Apellido Cliente < /label> <
            input type = "text"
            className = "form-control"
            value = { this.state.nombre_apellido }
            onChange = { this.cambiar_nombre_apellido }
            /> < /
            div > <
            button className = "btn btn-primary mt-3"
            onClick = { this.enviar_formulario } >
            Cargar Factura <
            /button> < /
            form > <
            /div>
        );
    }
}

export default Registrar;