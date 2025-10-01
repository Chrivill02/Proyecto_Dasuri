import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql"; // debe estar configurado con mysql2/promise

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const citaId = parseInt(searchParams.get("cita_id"));

  if (isNaN(citaId)) {
    return NextResponse.json(
      { error: "El ID de cita debe ser un número válido" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT csd.cita_id, csd.servicio_id AS id_servicio, s.nombre_servicio, s.precio 
      FROM cita_servicio_detalle csd
      JOIN servicios s ON csd.servicio_id = s.id
      WHERE csd.cita_id = ?
      LIMIT 100
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

    const idCitaNum = parseInt(id_cita);
    if (isNaN(idCitaNum) || !id_servicios || !Array.isArray(id_servicios) || !id_servicios.every(id => Number.isInteger(id))) {
      return NextResponse.json(
        { error: "Datos incompletos o incorrectos" },
        { status: 400 }
      );
    }

    // Validar que los servicios existan
    const [validServices] = await pool.query(
      "SELECT id FROM servicios WHERE id IN (?)",
      [id_servicios]
    );
    if (validServices.length !== id_servicios.length) {
      return NextResponse.json(
        { error: "Uno o más IDs de servicios no son válidos" },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Eliminar relaciones existentes
      await connection.query(
        "DELETE FROM cita_servicio_detalle WHERE cita_id = ?",
        [idCitaNum]
      );

      // Insertar nuevas relaciones
      if (id_servicios.length > 0) {
        const values = id_servicios.map(servicio_id => [idCitaNum, servicio_id]);
        await connection.query(
          "INSERT INTO cita_servicio_detalle (cita_id, servicio_id) VALUES ?",
          [values]
        );
      }

      await connection.commit();
      return NextResponse.json({ success: true });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error al asociar servicios a la cita:", error);
    return NextResponse.json(
      { error: "Error al asociar servicios", details: error.message },
      { status: 500 }
    );
  }
}