import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

// Obtener una compra por ID
export async function GET(request, props) {
  const { id } = props.params;

  try {
    if (!id) {
      return NextResponse.json(
        { message: "ID no proporcionado" },
        { status: 400 }
      );
    }

    const [result] = await pool.query("SELECT * FROM detalles_compra WHERE id = ?", [id]);

    if (result.length === 0) {
      return NextResponse.json({ message: "Compra no encontrada" }, { status: 404 });
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// Eliminar una compra por ID
export async function DELETE(request, props) {
  const { id } = props.params;

  try {
    if (!id) {
      return NextResponse.json(
        { message: "ID no proporcionado" },
        { status: 400 }
      );
    }

    const [result] = await pool.query("DELETE FROM detalles_compra WHERE id = ?", [id]);
    const [result2] = await pool.query("DELETE FROM solicitudes WHERE compra_id = ?", [id]);
    

    if (result.affectedRows === 0 && result2.affectedRows === 0) {
      return NextResponse.json({ message: "Solicitud no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Solicitud eliminada correctamente" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Actualizar una compra por ID
export async function PUT(request, props) {
  const { id } = props.params;

  try {
    const data = await request.json();

    const [result] = await pool.query("UPDATE detalles_compra SET ? WHERE id = ?", [
      data,
      id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Solicitud no encontrada" }, { status: 404 });
    }

    const [updatedCompra] = await pool.query(
      "SELECT * FROM detalles_compra WHERE id = ?",
      [id]
    );

    return NextResponse.json(updatedCompra[0]);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
