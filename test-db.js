require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
});

pool.query('SELECT NOW() as now', (err, res) => {
  if (err) {
    console.error('Error al conectar a la BD:', err.message);
    process.exit(1);
  }
  console.log('¡Conexión exitosa!');
  console.log('Hora del servidor PostgreSQL:', res.rows[0].now);
  pool.end();
});
