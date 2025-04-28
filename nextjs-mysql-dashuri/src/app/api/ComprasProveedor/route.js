import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql"; // Asegúrate de que `pool` esté configurado con `mysql2/promise`

export async function GET() {
  try {
    // Usar pool.query() de mysql2/promise
    const [results] = await pool.query("SELECT * FROM proveedor");
    return NextResponse.json(results);
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
    const { nombre, telefono, correo } = await request.json();

    // Usar pool.query() de mysql2/promise con parámetros
    const [result] = await pool.query("INSERT INTO proveedor SET ?", {
      nombre,
      telefono,
      correo,
    });

    console.log(result);

    return NextResponse.json({
      id: result.insertId,
      nombre,
      telefono,
      correo,
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
