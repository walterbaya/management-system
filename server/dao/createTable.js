var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'palma_store'
});

connection.connect();
console.log("database connection is been created");

function createTable()  {
    connection.query('CREATE TABLE IF NOT EXISTS facturacion(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, nombre_articulo VARCHAR(80) NOT NULL, precio DOUBLE NOT NULL, fecha DATE, dni VARCHAR(100), nombre_y_apellido VARCHAR(400) NOT NULL);', function (err, rows, fields) {
        if (err) throw err("No se pudo crear la tabla de facturacion");
    });
}
module.exports = {
    createTable
}