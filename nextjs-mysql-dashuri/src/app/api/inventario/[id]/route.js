import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET(request, {params}){
    const resultado = await pool.query("SELECT * FROM detalles_compra WHERE id = ?", [params.id])
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
    const resultado = await pool.query("DELETE FROM detalles_compra WHERE id = ?", [params.id]);

    if (resultado.affectedRows === 0) {
        return NextResponse.json({
            message: "Producto no encontrado",
        }, {
            status: 400,
        });
    }

    return NextResponse.json({
        message: "Producto eliminado correctamente",
    });
}



export async function PUT(request, params){
    const data = await request.json()
    const resultado = await pool.query("UPDATE detalles_compra SET ? WHERE id = ?", [data, params.id])


    if (resultado.affectedRows == 0) {
        return NextResponse.json({
            message: "Producto no encontrado",
        }, {
            status: 404,
        });
    }

    const proveedor_actualizado = await pool.query("SELECT * FROM detalles_compra WHERE id = ?", [params.id]);

    return NextResponse.json(proveedor_actualizado[0]);

}