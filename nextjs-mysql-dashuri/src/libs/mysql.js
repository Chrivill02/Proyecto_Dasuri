import { createPool } from 'mysql2/promise';

export const pool = createPool({
  host: "localhost",
  user: "root",
  password: "bd1234",
  database: "dashuri",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
