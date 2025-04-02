import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET(){
	const result = await pool.query('SHOW TABLES;')
	return NextResponse.json({message:result});
}

export function POST(){
	return NextResponse.json({message:'Hola creando producto'});
}
