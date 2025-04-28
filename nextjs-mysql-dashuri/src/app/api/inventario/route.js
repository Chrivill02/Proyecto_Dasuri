import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET() {
  try {
    // Consulta para obtener productos junto con la categoría
    const [rows] = await pool.query(`
      SELECT p.id, p.nombre, p.stock, p.precio, p.fecha_exp, c.nombre AS categoria_nombre
      FROM producto p
      INNER JOIN categoria_producto c ON p.categoria_id = c.id;
    `);
    
    // Devolver los productos en formato JSON
    return NextResponse.json(rows); // Aquí solo devolvemos rows directamente, sin necesidad de leer la respuesta nuevamente
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { nombre, stock, precio, categoria_id, fecha_exp } = await request.json();

    // Realizar la inserción del producto
    const [result] = await pool.query('INSERT INTO producto SET ?', {
      nombre,
      stock,
      precio,
      categoria_id,
      fecha_exp,
    });

    // Devolver el producto insertado con su ID
    return NextResponse.json({
      nombre,
      stock,
      precio,
      categoria_id,
      fecha_exp,
      id: result.insertId,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
