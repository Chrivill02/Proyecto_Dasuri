import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET() {
  try {
    const [categorias] = await pool.query("SELECT cp.id AS id, cp.nombre AS nombre, COUNT(p.id) AS total_productos FROM categoria_producto cp LEFT JOIN producto p ON cp.id = p.categoria_id GROUP BY cp.id, cp.nombre ORDER BY total_productos DESC;");

    if (!categorias || categorias.length === 0) {
      console.log("No se encontraron categorías en la base de datos.");
    }

    return NextResponse.json(categorias);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { nombre } = await request.json();

    const [result] = await pool.query("INSERT INTO categoria_producto SET ?", {
      nombre
    });

    return NextResponse.json({
      nombre,
      id: result.insertId,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
