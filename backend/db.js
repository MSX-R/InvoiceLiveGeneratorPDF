// db.js
require('dotenv').config(); // Assurez-vous que le fichier .env est chargé

const mysql = require('mysql2/promise'); // Utilisation des promesses

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

module.exports = pool;