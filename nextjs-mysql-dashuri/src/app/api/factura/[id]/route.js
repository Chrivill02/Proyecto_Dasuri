import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET(request, {params}){
	const resultado = await pool.query("SELECT * FROM solicitudes WHERE id = ?", [params.id])
	console.log(resultado)
	
	if (resultado.length === 0) {
		return NextResponse.json({
			message : "Producto no encontrado",
		}, {
			status: 400,
		}
	)
	}
	return NextResponse.json(resultado[0]);
}

export async function DELETE(request, { params }) {
	const resultado = await pool.query("DELETE FROM solicitudes WHERE id = ?", [params.id]);

	if (resultado.affectedRows === 0) {
		return NextResponse.json({
			message: "Factura no encontrado",
		}, {
			status: 400,
		});
	}

	return NextResponse.json({
		message: "solicitud eliminado correctamente",
	});
}



export async function PUT(request, { params }) {
  try {
    const { estado } = await request.json();

    if (!estado) {
      return NextResponse.json({ message: "El campo 'estado' es requerido" }, { status: 400 });
    }

    // Verificar si la factura existe
    const [rows] = await pool.query("SELECT * FROM solicitudes WHERE id = ?", [params.id]);

    if (rows.length === 0) {
      return NextResponse.json({ message: "Factura no encontrada" }, { status: 404 });
    }

    // Actualizar el estado de la factura
    await pool.query("UPDATE solicitudes SET estado = ? WHERE id = ?", [estado, params.id]);

    // Obtener la factura actualizada
    const [actualizada] = await pool.query("SELECT * FROM solicitudes WHERE id = ?", [params.id]);

    return NextResponse.json({
      message: "Estado actualizado correctamente",
      data: actualizada[0]
    });

  } catch (error) {
    console.error("Error al actualizar estado:", error);
    return NextResponse.json({ message: "Error del servidor", error: error.message }, { status: 500 });
  }
}
