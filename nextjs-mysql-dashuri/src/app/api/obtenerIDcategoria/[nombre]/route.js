import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET(request, { params }) {
  try {
    const { nombre } = params;

    if (!nombre) {
      return NextResponse.json(
        { message: "Nombre de categoría no proporcionado" },
        { status: 400 }
      );
    }

    // Buscar solo el ID de la categoría por su nombre (case-insensitive)
    const [result] = await pool.query(
      `SELECT id AS categoria_id FROM categoria_producto WHERE LOWER(nombre) = LOWER(?) LIMIT 1`,
      [nombre.trim()]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { message: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ id: result[0].categoria_id });
  } catch (error) {
    console.error("Error en API categoría ID:", error);
    return NextResponse.json(
      {
        message: "Error al obtener ID de categoría",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
