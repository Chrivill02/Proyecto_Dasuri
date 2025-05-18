// /api/inventario/por-nombre/[nombre]/route.js
import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET(request, { params }) {
  const nombre = params.nombre;

  if (!nombre) {
    return NextResponse.json(
      { message: "Nombre no proporcionado" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.nombre, p.stock, p.precio, p.fecha_exp, c.nombre AS categoria_nombre
       FROM producto p
       INNER JOIN categoria_producto c ON p.categoria_id = c.id
       WHERE p.nombre LIKE ?`,
      [`%${nombre}%`]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}