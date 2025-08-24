import { NextResponse } from 'next/server';
import { pool } from '@/libs/mysql';

export async function POST(request) {
  try {
    const { usuario_id, accion, detalle, estado } = await request.json();
    const fecha = new Date();

    const [result] = await pool.query(
      'INSERT INTO bitacora_transacciones (usuario_id, accion, detalle, estado, fecha) VALUES (?, ?, ?, ?, ?)',
      [usuario_id, accion, JSON.stringify(detalle), estado, fecha]
    );

    return NextResponse.json({
      id: result.insertId,
      message: 'Evento registrado en bitácora',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al guardar en bitácora', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM bitacora_transacciones ORDER BY fecha DESC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener bitácora', details: error.message },
      { status: 500 }
    );
  }
}
