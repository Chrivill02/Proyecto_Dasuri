import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET(){
	try {
		const result = await pool.query('SELECT * FROM categoria_producto')
		return NextResponse.json(result);
	} catch (error) {
		console.log(error);	
		return NextResponse.json({message: error.message},{status: 500});
	}
}
