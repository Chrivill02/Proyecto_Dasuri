import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET(){
	const result = await pool.query('SELECT NOW()')
	return NextResponse.json({message:result[0]['NOW()']});
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
			//id: result.insertidcompra,
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
