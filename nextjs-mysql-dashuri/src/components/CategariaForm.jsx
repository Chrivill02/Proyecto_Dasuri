"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import ButtonCancel from "../components/buttonCancel";

function CategoriaForm() {
  const [producto, setProducto] = useState({
    nombre: "",
  });

  const form = useRef(null);
  const params = useParams();
  const router = useRouter();

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (params.id) {
      axios.get("/api/categoria/por-id/" + params.id).then((res) => {
        setProducto({
          nombre: res.data.nombre,
        });
      });
    }
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!params.id) {
      const res = await axios.post("/api/categoria", producto);
    } else {
      await axios.put("/api/categoria/por-id/" + params.id, producto);
    }
    form.current.reset();
    router.refresh();
    router.push("/categoria");
  };

  return (
    <div className="bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4">
      <form onSubmit={handleSubmit} ref={form}>
        <label
          htmlFor="name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Nombre de la categoria{" "}
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

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mr-4">
          {params.id ? "Actualizar" : "Guardar"}
        </button>
      </form>
      <ButtonCancel />
    </div>
  );
}

export default CategoriaForm;
