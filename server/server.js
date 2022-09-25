var express = require('express');
var cors = require('cors');
const database_connection = require('./dao/createTable');

database_connection.create_table()
//create connection database
const dao = database_connection;

const app = express();
app.use(cors());
app.use(express.json());

var PORT = 3000;

app.post('/guardar_factura', function (req, res) {
    dao.create_factura(req.body);
    res.send();
});

app.listen(PORT, function () {
    console.log('Server is running on PORT:', PORT);
});