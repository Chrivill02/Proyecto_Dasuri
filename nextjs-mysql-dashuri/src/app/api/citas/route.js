import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET() {
	const results = await pool.query("SELECT * FROM cita_servicio");
	return NextResponse.json(results);
}

export async function POST(request) {
	try {
		const { nombre, fecha_cita, hora_cita, estado, costo } = await request.json();
		

		const usuario_id = 1;

		const result = await pool.query("INSERT INTO cita_servicio SET ?", {
			fecha_cita,
			hora_cita,
			estado,
			costo,
			usuario_id,
		});
		
		console.log(result);

		return NextResponse.json({
			fecha_cita,
			hora_cita,
			estado,
			costo,
			usuario_id,
		});
	} catch (error) {
		console.log(error);
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
