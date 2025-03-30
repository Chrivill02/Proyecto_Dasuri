import { NextResponse } from "next/server";

export function GET(){
	return NextResponse.json({message:'Hola buscando por id'});
}


export function DELETE(){
	return NextResponse.json({message:'Hola eliminando por id'});
}
export function PUT(){
	return NextResponse.json({message:'Hola actualizando por id'});
}