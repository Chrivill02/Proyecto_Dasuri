// src/app/api/proveedores/route.js
import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

// Agregar un proveedor
export async function POST(req) {
    const { nombre, telefono, correo } = await req.json();
    let connection;

    if (!nombre || !correo) {
        return NextResponse.json({
            success: false,
            message: "Nombre y correo son obligatorios"
        }, { status: 400 });
    }

    try {
        connection = await pool.getConnection();
        console.log("Conexión establecida correctamente");

        const [result] = await connection.query(
            "INSERT INTO proveedor (nombre, telefono, correo) VALUES (?, ?, ?)",
            [nombre, telefono, correo]
        );

        return NextResponse.json({
            success: true,
            message: "Proveedor agregado exitosamente",
            proveedorId: result.insertId
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        return NextResponse.json({
            success: false,
            message: "Error en el servidor",
            details: process.env.NODE_ENV === 'development' ? error.message : null
        }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}

// Eliminar un proveedor
export async function DELETE(req) {
    const { id } = await req.json();
    let connection;

    if (!id) {
        return NextResponse.json({
            success: false,
            message: "ID del proveedor no proporcionado"
        }, { status: 400 });
    }

    try {
        connection = await pool.getConnection();
        console.log("Conexión establecida correctamente");

        const [result] = await connection.query("DELETE FROM proveedor WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({
                success: false,
                message: "No se encontró el proveedor con el ID proporcionado"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Proveedor eliminado exitosamente"
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        return NextResponse.json({
            success: false,
            message: "Error en el servidor",
            details: process.env.NODE_ENV === 'development' ? error.message : null
        }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
