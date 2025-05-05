// src/app/api/cita_servicios_detalles/route.js

import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

// POST - Asocia servicios a una cita
export async function POST(request) {
    try {
        const body = await request.json();
        console.log("Datos recibidos en POST:", body);  // 🔍 Diagnóstico

        // Vamos a aceptar cualquiera de estas formas para mayor flexibilidad
        const cita_id = body.cita_id || body.id_cita;
        const id_servicios = body.id_servicios || body.servicios || [];

        if (!cita_id || !Array.isArray(id_servicios) || id_servicios.length === 0) {
            return NextResponse.json(
                { message: "Datos incompletos o incorrectos", body },
                { status: 400 }
            );
        }

        // Eliminar asociaciones existentes
        await pool.query("DELETE FROM cita_servicio_detalle WHERE cita_id = ?", [cita_id]);

        // Insertar cada servicio
        const inserts = id_servicios.map(id_servicio =>
            pool.query("INSERT INTO cita_servicio_detalle SET ?", {
                cita_id: cita_id,
                servicio_id: id_servicio,  // Aseguramos que use servicio_id según tu esquema de BD
            })
        );
        
        await Promise.all(inserts);

        return NextResponse.json({
            message: "Servicios asociados correctamente a la cita",
            cita_id,
            servicios_asociados: id_servicios
        });
    } catch (error) {
        console.log("Error en POST:", error);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}

// GET - Obtiene los servicios asociados a una cita
export async function GET(request) {
    try {
        const url = new URL(request.url);
        // Aceptamos cualquiera de los dos formatos de parámetro
        const cita_id = url.searchParams.get("cita_id") || url.searchParams.get("id_cita");

        if (!cita_id) {
            return NextResponse.json(
                { message: "ID de cita no proporcionado" },
                { status: 400 }
            );
        }

        // Modificamos la consulta para obtener información más detallada sobre los servicios
        const [servicios] = await pool.query(
            `SELECT csd.cita_id, csd.servicio_id as id_servicio, 
                    s.nombre_servicio, s.precio, s.descripcion
             FROM cita_servicio_detalle csd
             LEFT JOIN servicios s ON csd.servicio_id = s.id
             WHERE csd.cita_id = ?`,
            [cita_id]
        );

        if (servicios.length === 0) {
            return NextResponse.json({ 
                message: "Sin servicios",
                servicios: [] 
            });
        }

        return NextResponse.json(servicios);
    } catch (error) {
        console.log("Error en GET:", error);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}