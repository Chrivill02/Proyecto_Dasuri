// src/app/api/nueva_cita/route.js
import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql"; // debe estar configurado con mysql2/promise

// GET - Obtener todas las citas de servicio
export async function GET() {
    const [rows] = await pool.query("SELECT * FROM cita_servicio");
    return NextResponse.json(rows);
}

// POST - Crear una nueva cita de servicio
export async function POST(request) {
    try {
        const { 
            fecha_cita, 
            hora_cita, 
            estado, 
            costo, 
            nombre_cliente, 
            telefono_cliente 
        } = await request.json();

        const [result] = await pool.query(
            `INSERT INTO cita_servicio 
            (fecha_cita, hora_cita, estado, costo, nombre_cliente, telefono_cliente) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [fecha_cita, hora_cita, estado, costo, nombre_cliente, telefono_cliente]
        );

        return NextResponse.json({
            id: result.insertId,
            fecha_cita,
            hora_cita,
            estado,
            costo,
            nombre_cliente,
            telefono_cliente
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// PUT - Actualizar una cita de servicio existente
export async function PUT(request) {
    try {
        const { 
            id,
            fecha_cita, 
            hora_cita, 
            estado, 
            costo, 
            nombre_cliente, 
            telefono_cliente 
        } = await request.json();

        const [result] = await pool.query(
            `UPDATE cita_servicio 
             SET fecha_cita = ?, hora_cita = ?, estado = ?, costo = ?, nombre_cliente = ?, telefono_cliente = ? 
             WHERE id = ?`,
            [fecha_cita, hora_cita, estado, costo, nombre_cliente, telefono_cliente, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: "Cita no encontrada" }, { status: 404 });
        }

        return NextResponse.json({
            id,
            fecha_cita,
            hora_cita,
            estado,
            costo,
            nombre_cliente,
            telefono_cliente
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// DELETE - Eliminar una cita de servicio
export async function DELETE(request) {
    try {
        const { id } = await request.json();

        const [result] = await pool.query(
            "DELETE FROM cita_servicio WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: "Cita no encontrada" }, { status: 404 });
        }

        return NextResponse.json({ message: "Cita eliminada correctamente" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}