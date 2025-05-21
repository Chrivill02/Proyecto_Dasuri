// src/app/api/nueva_cita/route.js
import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql"; // Configurado con mysql2/promise

// GET - Obtener todas las citas usando procedimiento
export async function GET() {
  try {
    const [rows] = await pool.query("CALL obtener_citas()");
    return NextResponse.json(rows[0]); // CALL devuelve un array de arrays
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST - Crear una nueva cita usando procedimiento
export async function POST(request) {
  try {
    const {
      fecha_cita,
      hora_cita,
      estado,
      costo,
      nombre_cliente,
      telefono_cliente,
    } = await request.json();

    await pool.query("CALL crear_cita(?, ?, ?, ?, ?, ?)", [
      fecha_cita,
      hora_cita,
      estado,
      costo,
      nombre_cliente,
      telefono_cliente,
    ]);

    return NextResponse.json({
      message: "Cita creada correctamente",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT - Actualizar una cita existente usando procedimiento
export async function PUT(request) {
  try {
    const {
      id,
      fecha_cita,
      hora_cita,
      estado,
      costo,
      nombre_cliente,
      telefono_cliente,
    } = await request.json();

    const [result] = await pool.query("CALL actualizar_cita(?, ?, ?, ?, ?, ?, ?)", [
      id,
      fecha_cita,
      hora_cita,
      estado,
      costo,
      nombre_cliente,
      telefono_cliente,
    ]);

    return NextResponse.json({
      message: "Cita actualizada correctamente",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE - Eliminar una cita usando procedimiento
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    const [result] = await pool.query("CALL eliminar_cita(?)", [id]);

    return NextResponse.json({ message: "Cita eliminada correctamente" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
