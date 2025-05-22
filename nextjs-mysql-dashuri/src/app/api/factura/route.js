import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET() {
  try {
    const [result] = await pool.query(`
      SELECT 
      s.id AS solicitud_id,
      s.compra_id,
      s.estado,
      dc.id AS id_compra,
      dc.producto AS producto,
      dc.cantidad as cantidad,
      dc.precio as precio,
      dc.fecha_vencimiento as fecha_vencimiento,
      c.nombre as categoria_nombre,
      p.nombre as proveedor_nombre
      FROM solicitudes s INNER JOIN detalles_compra dc ON dc.id = s.compra_id
      INNER JOIN categoria_producto c ON c.id = dc.categoria_id
      INNER JOIN proveedor p ON p.id = dc.proveedor_id
      WHERE s.estado = 'En espera...'
    `);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    const { fecha, total, proveedor_id } = await request.json();

    // Usar pool.query() de mysql2/promise con parámetros
    const [result] = await pool.query("INSERT INTO solicitudes SET ?", {
      compra_id,
      estado,
    });

    console.log(result);

    return NextResponse.json({
      id: result.insertId,
      compra_id,
      estado,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
