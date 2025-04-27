import { NextResponse } from "next/server";
import { pool } from "@/libs/mysql";

export async function GET(){
    const result = await pool.query('SELECT NOW()')
    return NextResponse.json({message:result[0]['NOW()']});
}

export async function POST(request){
    try {

        const {fecha, total, proveedor_id} = await request.json()

        const result = await pool.query("INSERT INTO compra SET?",{
            fecha,
            total,
            proveedor_id
        });

        console.log(result);
        
        return NextResponse.json({
            id: result.insertidcompra,
            fecha,
            total,
            proveedor_id
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
