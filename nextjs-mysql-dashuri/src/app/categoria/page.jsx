"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Buttons from "./buttons";
import { useRouter } from "next/navigation";

export default function ViewInventario() {
  const [esAdmin, setEsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  
  const router = useRouter();

  useEffect(() => {
    const usuarioNivel = localStorage.getItem("usuarioNivel");
    if (usuarioNivel && parseInt(usuarioNivel) === 1) {
      setEsAdmin(true);
    } else {
      setEsAdmin(false);
    }

    const loadCategorias = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/categoria");
        setProducts(data);
        console.log(data)
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    loadCategorias();
  }, []);

  if (!esAdmin) {
    return <p>No tienes acceso a esta página.</p>;
  }

  return (
    <div className="relative overflow-x-auto p-9 bg-white mt-9">
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-3 rounded mr-4"
        onClick={() => {
          router.push("categoria/add");
        }}
      >
        Agregar
      </button>
      <table className="w-full text-sm text-left text-black border border-gray-400 mt-5">
        <thead className="text-xs uppercase bg-white text-black border-b border-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3">
              Cantidad de productos asociados
            </th>

            <th scope="col" className="px-6 py-3">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) &&
            products.map((product) => (
              <tr
                key={product.id}
                className="bg-white border-b border-gray-400"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-black whitespace-nowrap"
                >
                  {product.nombre &&
                    product.nombre.charAt(0).toUpperCase() +
                      product.nombre.slice(1)}
                </th>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-black whitespace-nowrap"
                >
                  {product.total_productos}
                </th>
                <Buttons productId={product.id} />
              </tr>
            ))}

          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"></tr>
        </tbody>
      </table>
    </div>
  );
}
