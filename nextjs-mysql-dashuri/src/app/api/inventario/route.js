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

    if (!nombre || !stock || !precio || !categoria_id || !fecha_exp) {
      return NextResponse.json({ message: "Todos los campos son requeridos" }, { status: 400 });
    }

    // Buscar si ya existe un producto con ese nombre
    const [existingRows] = await pool.query('SELECT * FROM producto WHERE nombre = ?', [nombre]);

    if (existingRows.length > 0) {
      const productoExistente = existingRows[0];
      const stockAnterior = productoExistente.stock;
      const precioAnterior = productoExistente.precio;

      const nuevoStock = stockAnterior + stock;
      const nuevoPrecio = ((precioAnterior * stockAnterior) + (precio * stock)) / nuevoStock;

      // Tomar la fecha de vencimiento más reciente
      const nuevaFecha = new Date(fecha_exp) > new Date(productoExistente.fecha_exp)
        ? fecha_exp
        : productoExistente.fecha_exp;

      await pool.query('UPDATE producto SET stock = ?, precio = ?, fecha_exp = ? WHERE id = ?', [
        nuevoStock,
        nuevoPrecio,
        nuevaFecha,
        productoExistente.id
      ]);

      return NextResponse.json({
        message: "Producto actualizado exitosamente",
        id: productoExistente.id,
        nombre,
        stock: nuevoStock,
        precio: nuevoPrecio,
        categoria_id,
        fecha_exp: nuevaFecha
      });
    } else {
      // Insertar nuevo producto
      const [result] = await pool.query('INSERT INTO producto SET ?', {
        nombre,
        stock,
        precio,
        categoria_id,
        fecha_exp
      });

      return NextResponse.json({
        message: "Producto creado exitosamente",
        id: result.insertId,
        nombre,
        stock,
        precio,
        categoria_id,
        fecha_exp
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
