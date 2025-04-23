import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET(){
	try {
		const result = await pool.query('SELECT p.id, p.nombre, p.stock, p.precio, p.fecha_exp, c.nombre AS categoria_nombre FROM producto p INNER JOIN categoria_producto c ON p.categoria_id = c.id;')
		return NextResponse.json(result);
	} catch (error) {
		console.log(error);	
		return NextResponse.json({message: error.message},{status: 500});
	}
}

export async function POST(request){
	try {
		const {nombre,stock,precio,categoria_id,fecha_exp} = await request.json()
		const result = await pool.query('INSERT INTO producto SET?',{
			nombre: nombre,
			stock: stock,
			precio: precio,
			categoria_id: categoria_id,
			fecha_exp: fecha_exp
		})

		console.log(result);
		return NextResponse.json({
			nombre,
			stock,
      precio,
      categoria_id,
			fecha_exp,
      id: result.insertId,
		});
	} catch (error) {
		console.log(error);	
		return NextResponse.json({message: error.message},{status: 500});
	}
}
