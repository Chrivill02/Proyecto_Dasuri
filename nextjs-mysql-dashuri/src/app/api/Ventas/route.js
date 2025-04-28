// src/app/api/ventas/route.js
import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET() {
    let connection;
    try {
        // 1. Obtener conexión
        connection = await pool.getConnection();
        console.log("Conexión establecida correctamente");

        // 2. Ejecutar consulta de prueba
        const [testResult] = await connection.query("SELECT 1+1 AS test");
        console.log("Resultado de prueba:", testResult);

        // 3. Consulta real con manejo de errores explícito
        const [ventas] = await connection.query(`
            SELECT v.*, u.nombre as usuario_nombre 
            FROM venta v
            LEFT JOIN usuario u ON v.usuario_id = u.id
            LIMIT 10
        `);

        return NextResponse.json({
            success: true,
            data: ventas
        });
    } catch (error) {
        console.error("Error completo en el servidor:", {
            message: error.message,
            code: error.code,
            sqlMessage: error.sqlMessage,
            stack: error.stack
        });

        return NextResponse.json({
            success: false,
            message: "Error en el servidor",
            details: process.env.NODE_ENV === 'development' ? {
                mysqlError: error.code,
                sqlMessage: error.sqlMessage,
                fullError: error.message
            } : null
        }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}

export async function DELETE(req) {
    const { id } = await req.json();
    let connection;

    if (!id) {
        return NextResponse.json({
            success: false,
            message: "ID de venta no proporcionado"
        }, { status: 400 });
    }

    try {
        // 1. Obtener conexión
        connection = await pool.getConnection();
        console.log("Conexión establecida correctamente");

        // 2. Eliminar la venta
        const [result] = await connection.query("DELETE FROM venta WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({
                success: false,
                message: "No se encontró la venta con el ID proporcionado"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Venta eliminada exitosamente"
        });
    } catch (error) {
        console.error("Error completo en el servidor:", {
            message: error.message,
            code: error.code,
            sqlMessage: error.sqlMessage,
            stack: error.stack
        });

        return NextResponse.json({
            success: false,
            message: "Error en el servidor",
            details: process.env.NODE_ENV === 'development' ? {
                mysqlError: error.code,
                sqlMessage: error.sqlMessage,
                fullError: error.message
            } : null
        }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
