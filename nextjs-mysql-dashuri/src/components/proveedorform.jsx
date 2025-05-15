"use client";
import axios from "axios";
import { useRef, useState, useEffect } from "react";

function proveedorform() {
    const [proveedor, setProveedor] = useState({
        nombre: "",
        telefono: "",
        correo: "",
    });

    const [idEliminar, setIdEliminar] = useState("");
    const [mostrarModificar, setMostrarModificar] = useState(false);
    const [idModificar, setIdModificar] = useState("");

    const form = useRef(null);

    const handleChange = (e) => {
        setProveedor({
            ...proveedor,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post("/api/ComprasProveedor", proveedor);
        console.log(res);
        form.current.reset();
    };

    const handleDelete = async () => {
        if (!idEliminar) {
            alert("Por favor, ingresa un ID para eliminar.");
            return;
        }

        try {
            const res = await axios.delete(`/api/ComprasProveedor/${idEliminar}`);
            alert(`Proveedor con ID ${idEliminar} eliminado correctamente.`);
            setIdEliminar("");
        } catch (error) {
            console.error(error);
            alert("Error al eliminar proveedor :(");
        }
    };

    const handleUpdate = async () => {
        if (!idModificar) {
            alert("Por favor, ingresa un ID para modificar.");
            return;
        }

        try {
            const res = await axios.put(`/api/ComprasProveedor/${idModificar}`, proveedor);
            alert(`Proveedor con ID ${idModificar} actualizado correctamente.`);
            setIdModificar("");
            form.current.reset();
        } catch (error) {
            console.error(error);
            alert("Error al actualizar proveedor :(");
        }
    };
 

useEffect(() => {
  const obtenerProveedorPorId = async () => {
    if (!idModificar) return;

    try {
      const res = await axios.get(`/api/ComprasProveedor/${idModificar}`);
      const data = res.data;

      setProveedor({
        nombre: data.nombre,
        telefono: data.telefono,
        correo: data.correo,
      });
    } catch (error) {
      console.error("Error al obtener proveedor:", error);
      setProveedor({
        nombre: "",
        telefono: "",
        correo: "",
      });
    }
  };

  obtenerProveedorPorId();
}, [idModificar]);


    return (
        <form
            className="absolute bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4 w-[300px] h-[470px] top-[115px] left-[70px]"
            onSubmit={handleSubmit}
            ref={form}
        >
            <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">
                Nombre del proveedor:
            </label>
            <input
                name="nombre"
                type="text"
                placeholder="nombre"
                value={proveedor.nombre}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3"
            />

            <label htmlFor="tel" className="block text-gray-700 text-sm font-bold mb-2">
                Teléfono:
            </label>
            <input
                name="telefono"
                type="text"
                placeholder="telefono"
                value={proveedor.telefono}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3"
            />

            <label htmlFor="correo" className="block text-gray-700 text-sm font-bold mb-2">
                Correo:
            </label>
            <input
                name="correo"
                type="text"
                placeholder="correo"
                value={proveedor.correo}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3"
            />

            <button
                type="submit"
                style={{
                    position: "absolute",
                    top: "245px",
                    left: "85px",
                    width: "120px",
                    height: "40px",
                    backgroundColor: "#6600A1",
                    color: "#fff",
                    borderRadius: "12px",
                }}
            >
                Agregar
            </button>

            {/* Input y botón para eliminar proveedor */}
            <input
                type="number"
                placeholder="ID a eliminar"
                value={idEliminar}
                onChange={(e) => setIdEliminar(e.target.value)}
                className="absolute top-[295px] left-[15px] w-[120px] py-2 px-3 border rounded"
            />

            <button
                type="button"
                onClick={handleDelete}
                style={{
                    position: "absolute",
                    top: "295px",
                    left: "150px",
                    width: "120px",
                    height: "40px",
                    backgroundColor: "#A10000",
                    color: "#fff",
                    borderRadius: "12px",
                }}
            >
                🗑️ Eliminar
            </button>

            {/* Botón Modificar */}
            <button
                type="button"
                onClick={() => setMostrarModificar(!mostrarModificar)}
                style={{
                    position: "absolute",
                    top: "345px",
                    left: "15px",
                    width: "255px",
                    height: "40px",
                    backgroundColor: "#000000",
                    color: "#fff",
                    borderRadius: "4px",
                }}
            >
                Modificar ⌵
            </button>

            {/* Formulario desplegable de modificación */}
            {mostrarModificar && (
                <div
                    className="flex items-center space-x-2"
                    style={{
                        position: "absolute",
                        top: "395px",
                        left: "15px",
                        width: "255px",
                    }}
                >
                    <input
                        type="number"
                        placeholder="Elegir"
                        value={idModificar}
                        onChange={(e) => setIdModificar(e.target.value)}
                        className="w-[120px] py-2 px-3 border rounded"
                    />
                    <button
                        type="button"
                        onClick={handleUpdate}
                        style={{
                            backgroundColor: "#b68e0c",
                            color: "#000",
                            width: "120px",
                            height: "40px",
                            borderRadius: "8px",
                        }}
                    >
                        🔄 Actualizar
                    </button>
                </div>
            )}
        </form>
    );
}

export default proveedorform;
