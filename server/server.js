var express = require('express');
const database_connection = require('./dao/createTable');

//create connection database

database_connection.createTable();
var app = express();

var PORT = 3000;

app.post('/save_bill', function(req, res) {
    
    res.send('Hello world');
});

app.listen(PORT, function() {
    console.log('Server is running on PORT:',PORT);
});