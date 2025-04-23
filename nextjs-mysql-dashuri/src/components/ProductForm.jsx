"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import ButtonCancel from "./buttonCancel";

function ProductForm() {
  const [producto, setProducto] = useState({
    nombre: "",
    stock: "",
    precio: "",
    categoria_id: "",
    fecha_exp: "",
  });

  const form = useRef(null);
  const params = useParams();
  const router = useRouter();

  const obtenerSoloFecha = (fechaCompleta) => {
    const fecha = new Date(fechaCompleta);
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
  };

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (params.id) {
      axios.get("/api/inventario/" + params.id).then((res) => {
        setProducto({
          nombre: res.data.result[0].nombre,
          stock: res.data.result[0].stock,
          precio: res.data.result[0].precio,
          categoria_id: res.data.result[0].categoria_id,
          fecha_exp: obtenerSoloFecha(res.data.result[0].fecha_exp),
        });
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!params.id) {
      const res = await axios.post("/api/inventario", producto);
    } else {
      await axios.put("/api/inventario/" + params.id, producto);
    }
    form.current.reset();
    router.refresh();
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
          value={producto.nombre}
          required
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
          required
          className="shadow appearence-none border rounded w-full py-2 px-3"
        />

        <label
          htmlFor="precio"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Precio del producto
        </label>
        <input
          required
          name="precio"
          type="number"
          step="0.01"
          min="0"
          placeholder="00.00"
          onChange={handleChange}
          value={producto.precio}
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
          required
          value={producto.categoria_id}
          className="shadow appearence-none border rounded w-full py-2 px-3"
        />

        <label
          htmlFor="fecha_exp"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Fecha de Expiración
        </label>
        <input
          name="fecha_exp"
          type="date"
          placeholder="Fecha de Expiración"
          onChange={handleChange}
          required
          value={producto.fecha_exp}
          className="shadow appearence-none border rounded w-full py-2 px-3"
        />

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mr-4">
          {params.id ? "Actulaizar" : "Guardar"}
        </button>
      </form>
      <ButtonCancel />
    </divi>
  );
}

export default ProductForm;
