var express = require("express");
var cors = require("cors");
const fs = require("fs");
const path = require("path");
const database_connection = require("./dao/createTable");

database_connection.create_tables();

//create connection database
const dao = database_connection;
const app = express();
app.use(cors());
app.use(express.json());

var PORT = 3000;

// Nueva ruta para guardar JSON en una carpeta específica
app.post("http://localhost:8080/api/public/product/update_catalogue", function (req, res) {
  const jsonData = req.body;

  //Verificamos si la carpeta 'uploads' existe, si no, la creamos
  //En la parte de uploads va en realidad la ruta que vamos a utilizar para crear el archivo en la seccion del catalogo, en este caso va a ser 
  //Para el catalogo YES. 
  const uploadDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // Definimos la ruta donde se guardará el archivo JSON
  const filePath = path.join(uploadDir, 'articulos.json');

  // Guardamos el archivo JSON
  fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      console.error('Error al guardar el archivo:', err);
      return res.status(500).send('Error al guardar el archivo');
    }
    res.send('Archivo JSON guardado exitosamente en el servidor');
  });
});

// Ruta para guardar factura (tu código original)
app.post("/guardar_factura", function (req, res) {
  const validacion = validarFormulario(req.body);
  if (validacion == "ok") {
    dao.create_factura(req.body);
    res.send("success");
  } else {
    res.send(validacion);
  }
});

// Ruta para eliminar artículo por ID (tu código original)
app.delete("/delete_articulo/:id", function (req, res) {
  dao.delete_articulo(req.params);
  res.send("success");
});

// Ruta para agregar artículo (tu código original)
app.post("/agregar_articulo", function (req, res) {
  const validacion = validarFormularioArticulo(req.body);
  if (validacion == "ok") {
    dao.create_articulo(req.body);
    res.send("success");
  } else {
    res.send(validacion);
  }
});

// Ruta para registrar varios artículos (tu código original)
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

// Ruta para obtener todos los artículos (tu código original)
app.get("/get_articulos", function (req, res) {
  dao.get_all_articulos().then(data => res.send(data));
});

// Ruta para obtener artículo por ID (tu código original)
app.get("/get_articulo/:id", function (req, res) {
  dao.get_articulo_by_id(req.params.id).then(data => res.send(data));
});

// Ruta para obtener facturas entre dos fechas (tu código original)
app.get("/get_facturas_between/:fecha_desde/:fecha_hasta", function (req, res) {
  dao.get_facturas_between(req.params.fecha_desde, req.params.fecha_hasta).then(data => res.send(data));
});

// Funciones de validación (tu código original)
function validarFormulario(carrito) {
  carrito.articulos.forEach(articulo => {
    if (!articulo.nombre_articulo) {
      return "Error, se debe ingresar el nombre del articulo";
    }
    if (!articulo.precio || articulo.precio <= 0) {
      return "Error, se debe ingresar el precio de venta y debe ser mayor o igual a 0";
    }
  });
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

// Iniciar servidor en el puerto definido
app.listen(PORT, function () {
  console.log("Server is running on PORT:", PORT);
});
