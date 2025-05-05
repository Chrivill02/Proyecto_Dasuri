import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

// GET - Obtener todos los servicios
export async function GET() {
    try {
        const [rows] = await pool.query("SELECT * FROM servicios");
        return NextResponse.json(rows);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST - Crear un nuevo servicio
export async function POST(request) {
    try {
        const { nombre_servicio, precio } = await request.json();

        const [result] = await pool.query(
            "INSERT INTO servicios (nombre_servicio, precio) VALUES (?, ?)",
            [nombre_servicio, precio]
        );

        return NextResponse.json({
            id: result.insertId,
            nombre_servicio,
            precio
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// PUT - Actualizar un servicio existente
export async function PUT(request) {
    try {
        const { id, nombre_servicio, precio } = await request.json();

        const [result] = await pool.query(
            "UPDATE servicios SET nombre_servicio = ?, precio = ? WHERE id = ?",
            [nombre_servicio, precio, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: "Servicio no encontrado" }, { status: 404 });
        }

        return NextResponse.json({
            id,
            nombre_servicio,
            precio
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// DELETE - Eliminar un servicio
export async function DELETE(request) {
    try {
        const { id } = await request.json();

        const [result] = await pool.query(
            "DELETE FROM servicios WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: "Servicio no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ message: "Servicio eliminado correctamente" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}