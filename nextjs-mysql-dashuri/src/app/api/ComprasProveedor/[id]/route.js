import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql"; // Asegúrate de que `pool` esté configurado con `mysql2/promise`

export async function GET(request, { params }) {
  try {
    // Usar pool.query() de mysql2/promise
    const [resultado] = await pool.query("SELECT * FROM proveedor WHERE id = ?", [params.id]);
    console.log(resultado);

    if (resultado.length === 0) {
      return NextResponse.json(
        {
          message: "Producto no encontrado",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(resultado[0]);
  } catch (error) {
    console.error(error);
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
    const [resultado] = await pool.query("DELETE FROM proveedor WHERE id = ?", [params.id]);

    if (resultado.affectedRows === 0) {
      return NextResponse.json(
        {
          message: "Producto no encontrado",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({ message: "Producto eliminado" });
  } catch (error) {
    console.error(error);
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
    const [resultado] = await pool.query("UPDATE proveedor SET ? WHERE id = ?", [data, params.id]);

    if (resultado.affectedRows === 0) {
      return NextResponse.json(
        {
          message: "Producto no encontrado",
        },
        {
          status: 404,
        }
      );
    }

    // Recupera el proveedor actualizado
    const [proveedor_actualizado] = await pool.query("SELECT * FROM proveedor WHERE id = ?", [params.id]);

    return NextResponse.json(proveedor_actualizado[0]);
  } catch (error) {
    console.error(error);
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
