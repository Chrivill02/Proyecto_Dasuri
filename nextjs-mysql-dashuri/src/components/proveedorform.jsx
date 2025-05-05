"use client";
import axios from "axios";
import { useRef, useState } from "react";

function proveedorform() {
    const [proveedor, setProveedor] = useState({
        nombre: "",
        telefono: "",
        correo: "",
    });

    const [idEliminar, setIdEliminar] = useState(""); // nuevo estado para ID a eliminar
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
            setIdEliminar(""); // limpiar el input
        } catch (error) {
            console.error(error);
            alert("Error al eliminar proveedor :(");
        }
    };

    return (
        <form
            className="absolute bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4 w-[300px] h-[390px] top-[10px] left-[1185px]"
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
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3"
            />

            <button
                type="submit"
                style={{
                    position: "absolute",
                    top: "245px",
                    left: "15px",
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
                Eliminar
            </button>
        </form>
    );
}

export default proveedorform;
