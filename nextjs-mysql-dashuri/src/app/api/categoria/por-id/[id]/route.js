import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET(request, props) {
  const params = await props.params;
  try {
    
    const id =await params?.id;

    if (!id) {
      return NextResponse.json(
        { message: "ID no proporcionado" },
        { status: 400 }
      );
    }

    const [rows] = await pool.query("SELECT * FROM categoria_producto WHERE id = ?", [id]);
    if (rows.length === 0) {
      return NextResponse.json({ message: "Categoria no encontrada" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
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

    const result = await pool.query("DELETE FROM categoria_producto WHERE id = ?", [id]);

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
    const result = await pool.query("UPDATE categoria_producto SET ? WHERE id = ? ", [
      data,
      params.id,
    ]);
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }
    const updatedProducto = await pool.query(
      "SELECT * FROM categoria_producto WHERE id = ? ",
      [params.id]
    );
    return NextResponse.json(updatedProducto[0]);
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

