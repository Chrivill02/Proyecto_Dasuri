import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";


export async function GET() {
	const results = await pool.query("SELECT * FROM detalles_compra")
	return NextResponse.json(results)
}

export async function POST(request){
	try {

		const {producto, cantidad, proveedor_id, fecha_vencimiento} = await request.json()

		const result = await pool.query("INSERT INTO detalles_compra SET?",{
			producto,
			cantidad,
			proveedor_id,
			fecha_vencimiento
		});

		console.log(result);
		
		return NextResponse.json({ 
			id: result.insertId,
			producto,
			cantidad,
			proveedor_id,
			fecha_vencimiento
		});

	} catch (error) {
		
		console.log(error)
		return NextResponse.json(
			{
				message : error.message,
			},
			{
				status: 500,
			}
		);
	}
}