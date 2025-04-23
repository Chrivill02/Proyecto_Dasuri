import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET(request, props) {
  const params = await props.params;
  try {
    
    const nombre =await params?.nombre;
    

    if (!nombre) {
      return NextResponse.json(
        { message: "ID no proporcionado" },
        { status: 400 }
      );
    }

    const result = await pool.query("SELECT p.id, p.nombre, p.stock, p.precio,p.fecha_exp, c.nombre AS categoria_nombre FROM producto p INNER JOIN categoria_producto c ON p.categoria_id = c.id WHERE c.nombre = ?", [nombre]);
    if (result.length === 0) {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}