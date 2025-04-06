"use client";
import { useRouter } from "next/navigation";

function ButtonAdd() {
	const router = useRouter()
  return (
    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-3 rounded  mb-3" 
		onClick={()=>{
			router.push('/addInventario')
		}}	
		>
      Agregar
    </button>
  );
}

export default ButtonAdd;
