var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "palma_store",
});

connection.connect();
console.log("database connection is been created");

function create_table() {
  connection.query(
    "CREATE TABLE IF NOT EXISTS facturacion(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, nombre_articulo VARCHAR(80) NOT NULL, precio DOUBLE NOT NULL, fecha DATE, dni VARCHAR(100), nombre_y_apellido VARCHAR(400), cantidad DOUBLE NOT NULL);",
    function (err, rows, fields) {
      console.log(err);
      console.log(fields);
      console.log(rows);
    }
  );

  connection.query(
    "CREATE TABLE IF NOT EXISTS articulos(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, nombre_articulo VARCHAR(80) NOT NULL, talle DOUBLE NOT NULL, color VARCHAR(80) NOT NULL, cuero VARCHAR(80) NOT NULL, tipo VARCHAR(80) NOT NULL, genero BOOLEAN NOT NULL, cantidad DOUBLE NOT NULL, precio DOUBLE NOT NULL);",
    function (err, rows, fields) {
      console.log(err);
      console.log(fields);
      console.log(rows);
    }
  );
}

function create_articulo(articulo) {
  if (articulo.id === "" || articulo.id === undefined) {
    connection.query(
      "INSERT INTO articulos (nombre_articulo, talle, color, cuero, tipo, genero, cantidad, precio) VALUES" +
        "(" +
        convert_to_string(articulo.nombre_articulo).trim() +
        "," +
        convert_to_string(articulo.talle).trim() +
        "," +
        convert_to_string(articulo.color).trim() +
        "," +
        convert_to_string(articulo.cuero).trim() +
        "," +
        convert_to_string(articulo.tipo).trim() +
        "," +
        articulo.genero +
        "," +
        convert_to_string(articulo.cantidad).trim() +
        "," +
        convert_to_string(articulo.precio).trim() +
        ");",
      function (err, rows, fields) {
        console.log(err);
        console.log(fields);
        console.log(rows);
      }
    );
  } else {
    connection.query(
      "UPDATE articulos SET" +
        " nombre_articulo=" +
        convert_to_string(articulo.nombre_articulo).trim() +
        ", talle=" +
        convert_to_string(articulo.talle).trim() +
        ", color=" +
        convert_to_string(articulo.color).trim() +
        ", cuero=" +
        convert_to_string(articulo.cuero).trim() +
        ", tipo=" +
        convert_to_string(articulo.tipo).trim() +
        ", genero=" +
        articulo.genero +
        ", cantidad=" +
        
        convert_to_string(articulo.cantidad).trim() +
        ", precio=" +
        convert_to_string(articulo.precio).trim() +
        "WHERE id =" +
        convert_to_string(articulo.id).trim() +
        ";",
      function (error, results, fields) {
        console.log(error);
        console.log(results);
        console.log(fields);
      }
    );
  }
}

function delete_articulo(articulo){
  console.log("articulo");
  console.log(articulo);
  connection.query(
    "DELETE FROM articulos " + 
    "WHERE id =" +
    convert_to_string(articulo.id).trim() +
    ";",
    function (err, rows, fields) {
      console.log(err);
      console.log(fields);
      console.log(rows);
    }
  );
}

function create_factura(factura) {
  //p_debito = (5200*0.04) + (5200*0.035)*(0.21)

  connection.query(
    "INSERT INTO facturacion (nombre_articulo, precio, fecha, dni, nombre_y_apellido, cantidad) VALUES" +
      "(" +
      convert_to_string(factura.nombre_articulo) +
      "," +
      factura.precio +
      "," +
      convert_to_string(get_date()) +
      "," +
      convert_to_string(factura.dni_cliente) +
      "," +
      convert_to_string(factura.nombre_y_apellido) +
      "," +
      factura.cantidad +
      ");",
    function (err, rows, fields) {
      console.log(err);
      console.log(fields);
      console.log(rows);
    }
  );  
  connection.query(
    "UPDATE articulos SET " +
      "cantidad=" +
      parseInt(factura.articulo_cantidad - factura.cantidad)  +
      " WHERE id =" +
      convert_to_string(factura.id_articulo).trim() +
      ";",
    function (err, rows, fields) {
      console.log(err);
      console.log(fields);
      console.log(rows);
    }
  );
}


function get_all_facturas() {
  connection.query("SELECT * FROM facturacion;", function (err, rows, fields) {
    return rows;
  });
}

function get_articulo(article_name) {
  connection.query(
    "SELECT * FROM articulos WHERE nombre = " +
      convert_to_string(article_name) +
      ";",
    function (err, rows, fields) {
      console.log(fields);
      console.log(err);
      return rows;
    }
  );
}

async function get_all_articulos() {
  const res = await aux();
  res.forEach((element) => {
    element.talle = element.talle.toString().toUpperCase().trim();
    element.cuero = element.cuero.toString().toUpperCase().trim();
    element.color = element.color.toString().toUpperCase().trim();
    element.tipo = element.tipo.toString().toUpperCase().trim();
    element.nombre_articulo = element.nombre_articulo
      .toString()
      .toUpperCase()
      .trim();
  });
  return res;
}

//Auxiliar Functions

function aux() {
  return new Promise((resolve) => {
    connection.query(
      "SELECT * FROM articulos;",
      function (error, results, fields) {
        resolve(results);
      }
    );
  });
}


async function  get_facturas_between(fecha_desde, fecha_hasta) {
  const res = await aux_2(fecha_desde, fecha_hasta);
  return res;
}

//Auxiliar Functions

function aux_2(fecha_desde, fecha_hasta) {
  return new Promise((resolve) => {
    connection.query(
      connection.query(
        "SELECT * FROM facturacion WHERE fecha >= " +
          convert_to_string(fecha_desde) +
          "AND fecha <=" +
          convert_to_string(fecha_hasta) +
          ";"),
      function (error, results, fields) {
        resolve(results);
      }
    );
  });
}





function convert_to_string(value) {
  if (!value) {
    value = "";
  }
  return "'" + value + "'";
}

function get_date() {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  console.log(day + "/" + month + "/" + date.getFullYear());
  return date.getFullYear() + "/" + month + "/" + day;
}

module.exports = {
  create_table,
  create_factura,
  get_all_facturas,
  get_all_articulos,
  //get_facturas_like,
  get_facturas_between,
  get_articulo,
  create_articulo,
  delete_articulo,
};
