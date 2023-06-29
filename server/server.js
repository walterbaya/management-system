var express = require("express");
var cors = require("cors");
const database_connection = require("./dao/createTable");

database_connection.create_table();

//create connection database
const dao = database_connection;

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

app.get("/get_articulos", async function (req, res) {
  console.log(dao.get_all_articulos());
  res.send(dao.get_all_articulos());
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
