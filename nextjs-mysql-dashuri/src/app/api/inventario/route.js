import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET() {
	try {
	  const [rows] = await pool.query(`
		SELECT p.id, p.nombre, p.stock, p.precio, p.fecha_exp, c.nombre AS categoria_nombre
		FROM producto p
		INNER JOIN categoria_producto c ON p.categoria_id = c.id;
	  `);
	  const response = NextResponse.json(rows);
	  const data = await response.json();  // Esto lee el cuerpo de la respuesta y lo convierte en un objeto JavaScript
	  console.log(data);
	  return NextResponse.json(rows); // <--- ¡sólo devolvemos rows!
	} catch (error) {
	  console.log(error);
	  return NextResponse.json({ message: error.message }, { status: 500 });
	}
  }
  

export async function POST(request){
	try {
		const {nombre,stock,precio,categoria_id,fecha_exp} = await request.json()
		const [result] = await pool.query('INSERT INTO producto SET ?', {
			nombre,
			stock,
			precio,
			categoria_id,
			fecha_exp
		  });
		  

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
