"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
function Buttons({ productId }) {
	const router = useRouter();
  return (
    <td>
      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-3 rounded mr-4"
      onClick={()=>{
        router.push('/inventario/edit/' + productId)
      }} 
      >
        Actualizar
      </button>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-3 rounded"
        onClick={async () => {
          if (confirm('(¿Estas seguro de eliminar el producto?\n¡Todas los registros de ventas de este serán eliminadas de igual manera!')) {
            const res = await axios.delete('/api/inventario/' + productId)
						if(res.status === 200){
							router.refresh()
						}
          }
        }}
      >
        Eliminar
      </button>
    </td>
  );
}

export default Buttons;
