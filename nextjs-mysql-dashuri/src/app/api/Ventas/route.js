// src/app/api/ventas/route.js
import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET() {
    let connection;
    try {
        // 1. Obtener conexión
        connection = await pool.getConnection();
        console.log("Conexión establecida correctamente");

        // 2. Ejecutar consulta de prueba (opcional)
        const [testResult] = await connection.query("SELECT 1+1 AS test");
        console.log("Resultado de prueba:", testResult);

        // 3. Llamar al procedimiento almacenado
        const [results] = await connection.query("CALL p_obtener_ventas(?, ?)", [50, 0]);
        
        // Los procedimientos almacenados devuelven un array de resultados
        // El primer elemento es el conjunto de filas que necesitamos
        const ventas = results[0];

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

export async function POST(req) {
    const { usuario_id, total, descripcion } = await req.json();
    let connection;
  
    if (!usuario_id || !total) {
      return NextResponse.json({
        success: false,
        message: "Datos incompletos para crear la venta"
      }, { status: 400 });
    }
  
    try {
      connection = await pool.getConnection();
      
      const [result] = await connection.query(
        "INSERT INTO venta (usuario_id, total, descripcion) VALUES (?, ?, ?)",
        [usuario_id, total, descripcion]
      );
  
      return NextResponse.json({
        success: true,
        message: "Venta creada exitosamente",
        id: result.insertId
      });
    } catch (error) {
      console.error("Error al crear venta:", error);
      return NextResponse.json({
        success: false,
        message: "Error al crear la venta",
        details: process.env.NODE_ENV === 'development' ? error.message : null
      }, { status: 500 });
    } finally {
      if (connection) connection.release();
    }
  }