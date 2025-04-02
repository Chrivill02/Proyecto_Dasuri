/*
1.La carpeta hello hace referencia a cualquier modulo que esten trabajando (catalogo,clientes,inventario) por lo que le pueden poner cualquiera de esos nombres para guiarse en su modulo

2.El arhivo obligado de llama route.js porque de esa manera lo busca next

3.Entonces la carpeta api sirve para hacer peticiones a la base de datos por lo que si necesitan hacerlo deben crear su carpeta y lo demas que pueden ver en el video para hacer sus peticiones

OJO!!: 
	import { pool } from "@/libs/mysql";
esta linea nos importa la coneccion a la base de datos por lo que sus datos son diferentes tener en cuanta eso verifiquen el archivo pool y sus valores para la conexion de la base de datos
*/

import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";


export async function GET() {
	const result = await pool.query("SELECT NOW()")
	return NextResponse.json( {message: result[0]["NOW()"]} )
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

		console.log(result);
		
		return NextResponse.json({
			//id: result.insertidcompra,
			compra_id,
			producto_id,
			cantidad,
			precio_unitario,
			sub_total,
			detalles
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
