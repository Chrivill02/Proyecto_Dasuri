import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Conexión a la base de datos
const pool = mysql.createPool({
  host: 'localhost',
  user: 'tu_usuario',
  password: 'tu_contraseña',
  database: 'dashuri',
});

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM producto');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener productos', details: error.message }, { status: 500 });
  }
}
