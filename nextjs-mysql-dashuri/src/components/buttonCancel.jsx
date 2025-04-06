"use client";
import { useRouter } from "next/navigation";

function ButtonCancel() {
	const router = useRouter()
  return (
    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
		onClick={()=>{
			router.back()
		}}
		>
      Cancelar
    </button>
  );
}

export default ButtonCancel;
