const dotenv = require('dotenv').config();

module.exports = {
  DATABASE:process.env.DATABASE,
  PASSWORD:process.env.PASSWORD,
  USER:process.env.USER,
  HOST:process.env.HOST,
  PORT: process.env.PORT
}
