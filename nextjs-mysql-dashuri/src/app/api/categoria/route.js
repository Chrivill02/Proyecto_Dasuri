import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET() {
  try {
    // Consulta a la tabla de categorías
    const [categorias] = await pool.query('SELECT * FROM categoria_producto');
    console.log("Categorías obtenidas desde la base de datos:", categorias);  // Verifica qué datos estamos obteniendo

    if (!categorias || categorias.length === 0) {
      console.log("No se encontraron categorías en la base de datos.");
    }

    return NextResponse.json(categorias);  // Devolvemos las categorías como respuesta JSON
  } catch (error) {
    console.log("Error al obtener categorías:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
