// const mysql = require('mysql2/promise');

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',   // ganti sesuai user MySQL kamu
//   password: '',   // ganti sesuai password MySQL kamu
//   database: 'sistem_keperawatan'
// });

// db.connect(err => {
//   if (err) {
//     console.error('Database connection failed:', err);
//     return;
//   }
//   console.log('Database connected');
// });

// module.exports = db;

// db.js
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // ganti sesuai password MySQL kamu
  database: 'sistem_keperawatan'
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0
});

module.exports = db;

