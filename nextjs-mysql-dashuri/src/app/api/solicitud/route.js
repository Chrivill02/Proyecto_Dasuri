import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql"; // Asegúrate de que `pool` esté configurado con `mysql2/promise`

export async function GET() {
  try {
    // Usar pool.query() de mysql2/promise
    const [result] = await pool.query("SELECT * FROM compra");
    return NextResponse.json(result);
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

export async function POST(request) {
  try {
    const { fecha, total, proveedor_id } = await request.json();

    // Usar pool.query() de mysql2/promise con parámetros
    const [result] = await pool.query("INSERT INTO compra SET ?", {
      fecha,
      total,
      proveedor_id,
    });

    console.log(result);

    return NextResponse.json({
      id: result.insertId, // Usa `insertId` en lugar de `insertidcompra`
      fecha,
      total,
      proveedor_id,
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
