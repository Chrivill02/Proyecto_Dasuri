import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET() {
    try {
        const [rows] = await pool.query("SELECT * FROM venta;");
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener las ventas", details: error.message }, { status: 500 });
    }
}
