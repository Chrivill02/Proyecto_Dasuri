import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3307,  // Puerto específico 3307
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',  // Contraseña vacía por defecto
  database: process.env.DB_NAME || 'dashuri',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;