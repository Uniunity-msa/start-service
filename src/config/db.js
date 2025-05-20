// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "root",
//     database: "start_service_db"
// });

// connection.connect(err => {
//     if (err) {
//         console.error('MySQL 연결 오류:', err);
//         return;
//     }
//     console.log('MySQL 연결 성공');
// });

// module.exports = connection;

const mysql = require('mysql2');
require("dotenv").config();

console.log("mysql 연결시도");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.START_SERVICE_DB_HOST,
  user: process.env.START_SERVICE_DB_USER,
  password: process.env.START_SERVICE_DB_PASSWORD,
  database: process.env.START_SERVICE_DB_NAME,
  port: process.env.START_SERVICE_DB_PORT,
  charset: 'utf8mb4'
});

module.exports = { pool };


