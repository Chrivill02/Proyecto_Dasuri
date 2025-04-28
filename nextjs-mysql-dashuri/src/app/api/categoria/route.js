import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET() {
  try {
    // Consulta a la tabla de categorías
    const [categorias] = await pool.query('SELECT * FROM categoria_producto');
    console.log(categorias);  // Asegúrate de que esta consulta devuelva las categorías

    return NextResponse.json(categorias);  // Devolvemos las categorías como respuesta JSON
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
