import pool from '@/lib/db';
import { NextResponse } from 'next/server';

// Consultas reutilizables (Norma 7) - CORREGIDO
const QUERIES = {
  PRODUCTOS_ACTIVOS: `
    SELECT p.id, p.nombre, p.precio, p.stock, p.imagen_url, c.nombre as categoria 
    FROM producto p 
    JOIN categoria_producto c ON p.categoria_id = c.id
    WHERE p.stock > 0
    ORDER BY p.nombre
  `
};

export async function GET() {
  try {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query(QUERIES.PRODUCTOS_ACTIVOS);
      return NextResponse.json(rows);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error en consulta de productos:', error);
    return NextResponse.json(
      { 
        error: 'Error al obtener productos',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}