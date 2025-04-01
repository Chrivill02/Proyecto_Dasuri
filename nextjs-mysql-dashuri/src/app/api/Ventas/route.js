import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";


//Get para obtener las ventas


export async function GET(){
    const result = await pool.query('SELECT NOW()')
    return NextResponse.json({message:result[0]['NOW()']});
}
/*
export async function POST(){
    return NextResponse.json({message:'Hola creando producto'});
}
*/

    