import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.nombre, p.precio, p.stock, p.imagen, c.nombre as categoria 
      FROM producto p 
      JOIN categoria_producto c ON p.categoria_id = c.id
      WHERE p.stock > 0
    `);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}