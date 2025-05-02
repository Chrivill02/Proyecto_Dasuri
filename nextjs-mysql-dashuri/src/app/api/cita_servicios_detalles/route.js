// src/app/api/cita_servicios_detalles/route.js

import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

// POST - Asocia servicios a una cita
export async function POST(request) {
    try {
        const body = await request.json();
        console.log("Datos recibidos en POST:", body);  // 🔍 Diagnóstico

        const { cita_id, id_servicios } = body;

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
                servicio_id: id_servicio,  // <- CORREGIDO AQUÍ
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
        const cita_id = url.searchParams.get("cita_id");

        if (!cita_id) {
            return NextResponse.json(
                { message: "ID de cita no proporcionado" },
                { status: 400 }
            );
        }

        const [servicios] = await pool.query(
            `SELECT csd.* 
             FROM cita_servicio_detalle csd
             WHERE csd.cita_id = ?`,
            [cita_id]
        );

        return NextResponse.json(servicios);
    } catch (error) {
        console.log("Error en GET:", error);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}
