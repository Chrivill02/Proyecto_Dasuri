import { NextResponse } from "next/server";
import { pool } from "@/config/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const citaId = searchParams.get("cita_id");

  if (!citaId) {
    return NextResponse.json(
      { error: "Se requiere un ID de cita" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT csd.cita_id, csd.servicio_id as id_servicio, s.nombre_servicio, s.precio 
      FROM cita_servicio_detalle csd
      JOIN servicios s ON csd.servicio_id = s.id
      WHERE csd.cita_id = ?
      `,
      [citaId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener servicios de la cita:", error);
    return NextResponse.json(
      { error: "Error al obtener servicios" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { id_cita, id_servicios } = data;

    if (!id_cita || !id_servicios || !Array.isArray(id_servicios)) {
      return NextResponse.json(
        { error: "Datos incompletos o incorrectos" },
        { status: 400 }
      );
    }

    // Primero eliminamos todas las relaciones existentes para esta cita
    await pool.query(
      "DELETE FROM cita_servicio_detalle WHERE cita_id = ?",
      [id_cita]
    );

    // Luego insertamos las nuevas relaciones
    if (id_servicios.length > 0) {
      const values = id_servicios.map(servicio_id => [id_cita, servicio_id]);
      
      // Insertamos todos los servicios de una vez
      await pool.query(
        "INSERT INTO cita_servicio_detalle (cita_id, servicio_id) VALUES ?",
        [values]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al asociar servicios a la cita:", error);
    return NextResponse.json(
      { error: "Error al asociar servicios", details: error.message },
      { status: 500 }
    );
  }
}