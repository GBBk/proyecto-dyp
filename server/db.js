const mysql = require("mysql");
require("dotenv").config();

const DB_POOL = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
});

const DB_CONNECTION = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
});

module.exports = {
  DB_CONNECTION: DB_CONNECTION,
  DB_POOL: DB_POOL,
};
