import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";


export async function GET() {
	const results = await pool.query("SELECT * FROM proveedor")
	return NextResponse.json(results)
}

export async function POST(request){
	try {

		const {nombre, telefono, correo} = await request.json()

		const result = await pool.query("INSERT INTO proveedor SET?",{
			nombre,
			telefono,
			correo
		});

		console.log(result);
		
		return NextResponse.json({ 
			id: result.insertId,
			nombre,
			telefono,
			correo
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
