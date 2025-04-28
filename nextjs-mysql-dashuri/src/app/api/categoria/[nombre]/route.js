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

    // Consulta modificada para hacer la comparación case-insensitive
    const [result] = await pool.query(
      `SELECT 
        p.id, 
        p.nombre, 
        p.stock, 
        p.precio,
        p.fecha_exp, 
        c.nombre AS categoria_nombre 
       FROM producto p 
       INNER JOIN categoria_producto c ON p.categoria_id = c.id 
       WHERE LOWER(c.nombre) = LOWER(?)`, 
      [nombre.trim()]
    );

    // Siempre devolver un array, incluso si está vacío
    return NextResponse.json(Array.isArray(result) ? result : []);
    
  } catch (error) {
    console.error("Error en API categoría:", error);
    return NextResponse.json(
      { 
        message: "Error al obtener productos por categoría",
        error: error.message 
      },
      { status: 500 }
    );
  }
}