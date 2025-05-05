// src/app/api/cita_servicio_detalle/route.js
import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

// POST - Asocia servicios a una cita
export async function POST(request) {
    try {
        const { id_cita, id_servicios } = await request.json();

        if (!id_cita || !Array.isArray(id_servicios) || id_servicios.length === 0) {
            return NextResponse.json(
                { message: "Datos incompletos o incorrectos" },
                { status: 400 }
            );
        }

        // Insertar cada servicio para la cita
        const inserts = id_servicios.map(id_servicio =>
            pool.query("INSERT INTO cita_servicio_detalle SET ?", {
                id_cita,
                id_servicio,
            })
        );

        await Promise.all(inserts);

        return NextResponse.json({
            message: "Servicios asociados correctamente a la cita",
            id_cita,
            servicios_asociados: id_servicios
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}
