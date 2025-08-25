// src/app/api/bitacora/route.js
import { NextResponse } from "next/server";

// 🔹 Insertar nuevo registro en bitácora
export async function POST(request) {
  try {
    const data = await request.json();

    const {usuario_id, accion, detalle, estado, fecha } = data;

    if (!usuario_id || !accion || !estado) {
      return NextResponse.json(
        { message: "Faltan datos obligatorios (usuario_id, accion, estado)" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO bitacora_transacciones 
      (usuario_id, accion, detalle, estado, fecha)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [usuario_id, accion, detalle, estado, fecha];
    const [result] = await pool.query(query, values);

    return NextResponse.json(
      { message: "Evento registrado correctamente", id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error en /api/bitacora:", error);
    return NextResponse.json(
      { message: "Error al guardar en bitácora", error: error.message },
      { status: 500 }
    );
  }
}


