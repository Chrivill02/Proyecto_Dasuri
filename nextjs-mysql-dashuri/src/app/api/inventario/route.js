import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET(){
	try {
		const result = await pool.query('SELECT * FROM producto')
		return NextResponse.json(result);
	} catch (error) {
		console.log(error);	
		return NextResponse.json({message: error.message},{status: 500});
	}
}

export async function POST(request){
	try {
		const {nombre,stock,precio,categoria_id} = await request.json()
		const result = await pool.query('INSERT INTO producto SET?',{
			nombre: nombre,
			stock: stock,
			precio: precio,
			categoria_id: categoria_id,
		})

		console.log(result);
		return NextResponse.json({
			nombre,
			stock,
      precio,
      categoria_id,
      id: result.insertId,
		});
	} catch (error) {
		console.log(error);	
		return NextResponse.json({message: error.message},{status: 500});
	}
}
