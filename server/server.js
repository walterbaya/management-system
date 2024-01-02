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

app.delete("/delete_articulo/:id", function (req, res) {
  dao.delete_articulo(req.params);
  res.send("success");
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

app.post("/registrar_articulos", function (req, res) {
  const validacion = validarArticulos(req.body);
  if (validacion == "ok") {
    let articulos = req.body;
    articulos.forEach(articulo => {
      dao.create_articulo(articulo);
    });
    res.send("success");
  } else {
    res.send(validacion);
  }
});

app.get("/get_articulos", function (req, res) {
  dao.get_all_articulos().then(data => res.send(data));
});

app.get("/get_articulo_by_id/:id", function (req, res) {
  dao.get_articulo_by_id(req.params.id).then(data => res.send(data));
});

app.get("/get_facturas_between/:fecha_desde/:fecha_hasta", function (req, res) {
  dao.get_facturas_between(req.params.fecha_desde, req.params.fecha_hasta).then(data => res.send(data));
});


app.listen(PORT, function () {
  console.log("Server is running on PORT:", PORT);
});

function validarFormulario(factura) {
  if (!factura.nombre_articulo) {
    return "Error, se debe ingresar el nombre del articulo";
  }
  if (!factura.precio || factura.precio <= 0) {
    return "Error, se debe ingresar el precio de venta y debe ser mayor o igual a 0";
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

function validarArticulos(articulos) {
  return "ok";
}
