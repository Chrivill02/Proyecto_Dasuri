import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET(request, { params }) {
  try {
    const result = await pool.query("SELECT * FROM producto WHERE id = ?", [
      params.id,
    ]);
    if (result.length === 0) {
      return NextResponse.json({ message: "Producto no encontrado" });
    }
    return NextResponse.json({ result: result }, { status: 404 });
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

export async function DELETE(request, { params }) {
  try {
    const result = await pool.query("DELETE FROM producto WHERE id = ?", [
      params.id,
    ]);
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Producto no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Producto eliminado", result: result });
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

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const result = await pool.query("UPDATE producto SET ? WHERE id = ? ", [
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
      "SELECT * FROM producto WHERE id = ? ",
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
