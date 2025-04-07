"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import ButtonCancel from "./buttonCancel";

function ProductForm() {
  const router = useRouter();

  const [producto, setProducto] = useState({
    nombre: "",
    stock: 0,
    precio: 0,
    categoria_id: 0,
  });

  const form = useRef(null);
  const params = useParams();

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (params.id) {
      console.log(params.id)
      axios.get('/api/inventario/'+params.id).then((res) => {
        setProducto({
          nombre: res.data.nombre,
          stock: res.data.stock,
          precio: res.data.precio,
          categoria_id: res.data.categoria_id
        });
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("/api/inventario", producto);
    form.current.reset();
    router.push("/inventario");
  };

  return (
    <divi className="bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4">
      <form onSubmit={handleSubmit} ref={form}>
        <label
          htmlFor="name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Nombre del producto{" "}
        </label>
        <input
          name="nombre"
          type="text"
          placeholder="nombre"
          onChange={handleChange}
          valur={producto.nombre}
          className="shadow appearence-none border rounded w-full py-2 px-3"
        />

        <label
          htmlFor="stock"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Stock del producto
        </label>
        <input
          name="stock"
          type="number"
          placeholder="stock"
          onChange={handleChange}
          value={producto.stock}
          className="shadow appearence-none border rounded w-full py-2 px-3"
        />

        <label
          htmlFor="precio"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Precio del producto
        </label>
        <input
          name="precio"
          type="number"
          step="0.01"
          min="0"
          placeholder="00.00"
          onChange={handleChange}
          valur={producto.precio}
          className="shadow appearence-none border rounded w-full py-2 px-3"
        />

        <label
          htmlFor="categoria_id"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Categoria del producto
        </label>
        <input
          name="categoria_id"
          type="number"
          placeholder="Categoria"
          onChange={handleChange}
          valur={producto.categoria_id}
          className="shadow appearence-none border rounded w-full py-2 px-3"
        />

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mr-4">
          Guardar datos
        </button>
      </form>
      <ButtonCancel />
    </divi>
  );
}

export default ProductForm;
