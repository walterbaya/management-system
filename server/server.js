var express = require("express");
var cors = require("cors");
const database_connection = require("./dao/createTable");

database_connection.create_table();
<<<<<<< HEAD
var app = express();


database_connection.create_factura({
    nombre_articulo_cliente: "2840 Zapato Karina",
    precio_venta: 2000,
    dni_cliente: "39749587",
    nombre_y_apellido_cliente: "Walter Baya"
});

=======
//create connection database
const dao = database_connection;
>>>>>>> d19f5f4c5f85795c4d2a1bfa5c241234f3d7f9b4

const app = express();
app.use(cors());
app.use(express.json());

var PORT = 3000;

app.post("/guardar_factura", function (req, res) {
  const validacion = validarFormulario(req.body);
  if (validacion == "ok") {
    dao.create_factura(req.body);
    res.send("success");
  } else {
    res.send(validacion);
  }
});

app.post("/agregar_articulo", function (req, res) {
  const validacion = validarFormularioArticulo(req.body);
  if (validacion == "ok") {
    dao.create_articulo(req.body);
    res.send("success");
  } else {
    res.send(validacion);
  }
});

app.listen(PORT, function () {
  console.log("Server is running on PORT:", PORT);
});

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

function validarFormularioArticulo(factura) {
  if (!factura.nombre_articulo_cliente) {
    return "Error, se debe ingresar el nombre del articulo";
  }
  if (!factura.precio_venta || factura.precio_venta <= 0) {
    return "Error, se debe ingresar el precio  y debe ser mayor o igual a 0";
  }

  return "ok";
}
