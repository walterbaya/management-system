var express = require('express');
const database_connection = require('./dao/createTable');

//create connection database

database_connection.create_table();
var app = express();

/*
database_connection.create_factura({
    nombre_articulo_cliente: "2840 negro",
    precio_venta: 321239.2,
    dni_cliente: "4539958949",
    nombre_y_apellido_cliente: "Jose luis"
});

**/


var PORT = 3000;

app.post('/save_bill', function (req, res) {

    res.send('Hello world');
});

app.listen(PORT, function () {
    console.log('Server is running on PORT:', PORT);
});