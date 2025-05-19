import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql"; // Asegúrate de que `pool` esté configurado con mysql2/promise

// Método GET para obtener todas las solicitudes
export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.id AS solicitud_id,
        s.estado,
        dc.id AS compra_id,
        dc.producto,
        dc.cantidad,
        dc.precio,
        dc.fecha_vencimiento,
        cp.nombre AS categoria_nombre,
        pr.nombre AS proveedor_nombre
      FROM solicitudes s
      INNER JOIN detalles_compra dc ON s.compra_id = dc.id
      INNER JOIN categoria_producto cp ON dc.categoria_id = cp.id
      INNER JOIN proveedor pr ON dc.proveedor_id = pr.id
      ORDER BY s.id DESC;
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// Método POST para registrar una compra y su solicitud
export async function POST(request) {
  try {
    const {
      producto,
      cantidad,
      precio,
      categoria_id,
      proveedor_id,
      fecha_vencimiento,
    } = await request.json();

    // Insertar en detalles_compra
    const [compraResult] = await pool.query(
      `INSERT INTO detalles_compra 
       (producto, cantidad, precio, categoria_id, proveedor_id, fecha_vencimiento)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [producto, cantidad, precio, categoria_id, proveedor_id, fecha_vencimiento]
    );

    const compraId = compraResult.insertId;

    // Insertar en solicitudes con estado "En espera..."
    await pool.query(
      `INSERT INTO solicitudes (compra_id, estado) VALUES (?, ?)`,
      [compraId, "En espera..."]
    );

    return NextResponse.json({
      message: "Compra y solicitud registradas correctamente",
      compra_id: compraId,
      estado: "En espera...",
    });
  } catch (error) {
    console.error("Error al registrar compra y solicitud:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
