import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET(){
	const result = await pool.query('SELECT NOW()')
	return NextResponse.json({message:result[0]['NOW()']});
}

export async function POST(request){
	try {

		const {compra_id, producto_id, cantidad, precio_unitario, sub_total, detalles} = await request.json()

		const result = await pool.query("INSERT INTO detalles_compra SET?",{
			compra_id,
			producto_id,
			cantidad,
			precio_unitario,
			sub_total,
			detalles
		});
		
		return NextResponse.json({
			//id: result.insertidcompra,
			compra_id,
			producto_id,
			cantidad,
			precio_unitario,
			subtotal,
			detalles
		});
		
	} catch (error) {
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
