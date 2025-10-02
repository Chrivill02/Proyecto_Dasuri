import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET(request, { params }) {
  const id = params?.id;

  if (!id) {
    return NextResponse.json(
      { message: "ID no proporcionado" },
      { status: 400 }
    );
  }

  try {
    const [result] = await pool.query("CALL sp_get_producto(?)", [id]);

    if (result.length === 0) {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, props) {
  const params = await props.params;
  try {
    const id = params.id;

    const result = await pool.query("CALL sp_delete_producto(?)", [id]);

    if (!id) {
      return NextResponse.json(
        { message: "ID no proporcionado" },
        { status: 400 }
      );
    }

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request, props) {
  const params = await props.params;
  try {
    const data = await request.json();
    const { nombre, stock, precio, fecha_exp, categoria_id } = data;

    const [rows] = await pool.query(
      "CALL sp_update_producto(?, ?, ?, ?, ?, ?)",
      [params.id, nombre, stock, precio, fecha_exp, categoria_id]
    );

    if (!rows[0] || rows[0].length === 0) {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0][0]);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}