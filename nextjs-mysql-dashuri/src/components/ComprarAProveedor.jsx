"use client";
import axios from "axios";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

function comprarAproveedor() {
    const [compra, setCompra] = useState({
        producto: "",
        cantidad: "",
        proveedor_id: "",
        fecha_vencimiento: ""
    });

    const form = useRef(null);
    const router = useRouter();

    const handleChange = (e) => {
        setCompra({
            ...compra,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { producto, cantidad, proveedor_id, fecha_vencimiento } = compra;

        // Validación: todos los campos deben estar llenos
        if (!producto || !cantidad || !proveedor_id || !fecha_vencimiento) {
            alert("Debe llenar todos los campos.");
            return;
        }

        try {
            const res = await axios.post("/api/inventario", compra);
            alert("Compra registrada exitosamente.");
            console.log("Respuesta:", res.data);

            form.current.reset();
            setCompra({
                producto: "",
                cantidad: "",
                proveedor_id: "",
                fecha_vencimiento: ""
            });
        } catch (error) {
            console.error("Error al registrar la compra:", error);

            // Suponiendo que el backend responde con un 404 si el proveedor no existe
            if (error.response && error.response.status === 404) {
                alert("Ese proveedor no existe, intente con otro.");
            } else {
                alert("Error al guardar la compra.");
            }
        }
    };

    const irAgregarProveedor = () => {
        router.push("/agregarproveedor");
    };

    const [eliminarIdONombre, setEliminarIdONombre] = useState("");

const eliminarCompra = async () => {
    if (!eliminarIdONombre || isNaN(eliminarIdONombre)) {
        alert("Debe ingresar un ID numérico para eliminar.");
        return;
    }

    try {
        const res = await axios.delete(`/api/inventario/${eliminarIdONombre}`);
        alert(res.data.message);
        setEliminarIdONombre("");
    } catch (error) {
        console.error("Error al eliminar la compra:", error);
        alert("Error al eliminar la compra.");
    }
};



    return (
        <form
            className="absolute bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4 w-[850px] h-[300px] top-[10px] left-[323px]"
            ref={form}
            onSubmit={handleSubmit}
        >
            <label style={{ position: 'absolute', top: '20px', left: '20px', color: '#000' }}>
                Producto:
            </label>
            <input
                onChange={handleChange}
                name="producto"
                type="text"
                placeholder="Nombre del producto"
                style={{ position: 'absolute', top: '50px', left: '20px', width: '200px', height: '40px', backgroundColor: "#6600A1", color: '#000', borderRadius: '12px' }}
            />

            <label style={{ position: 'absolute', top: '110px', left: '20px', color: '#000' }}>
                Cantidad:
            </label>
            <input
                type="text"
                placeholder="Cantidad"
                onChange={handleChange}
                name="cantidad"
                style={{ position: 'absolute', top: '140px', left: '20px', width: '100px', height: '40px', backgroundColor: "#6600A1", color: '#000', borderRadius: '12px' }}
            />

            <label htmlFor="proveedor_id" style={{ position: 'absolute', top: '20px', left: '300px', color: '#000' }}>
                ID del Proveedor:
            </label>
            <input
                name="proveedor_id"
                type="text"
                placeholder="ID del proveedor"
                onChange={handleChange}
                style={{ position: 'absolute', top: '50px', left: '300px', width: '150px', height: '40px', backgroundColor: "#6600A1", color: '#000', borderRadius: '12px' }}
            />

            <label htmlFor="fecha_vencimiento" style={{ position: 'absolute', top: '110px', left: '300px', color: '#000' }}>
                Fecha de vencimiento:
            </label>
            <input
                name="fecha_vencimiento"
                type="date"
                onChange={handleChange}
                style={{ position: 'absolute', top: '140px', left: '300px', width: '180px', height: '40px', backgroundColor: "#6600A1", color: '#000', borderRadius: '12px' }}
            />

            <button
                type="submit"
                style={{ position: 'absolute', top: '240px', left: '650px', width: '150px', height: '40px', backgroundColor: "#a74be3", color: '#000', borderRadius: '12px' }}
            >
                Agregar Compra
            </button>

            <button
                onClick={irAgregarProveedor}
                type="button"
                style={{ position: 'absolute', top: '240px', left: '490px', width: '150px', height: '40px', backgroundColor: "#4CAF50", color: '#fff', borderRadius: '12px', border: 'none' }}
            >
                Agregar Proveedor
            </button>

            <label style={{ position: 'absolute', top: '190px', left: '550px', color: '#000' }}>
            ID o Nombre a eliminar:
        </label>
        <input
            type="text"
            value={eliminarIdONombre}
            onChange={(e) => setEliminarIdONombre(e.target.value)}
            style={{ position: 'absolute', top: '220px', left: '550px', width: '200px', height: '40px', backgroundColor: "#FFE5EC", color: '#000', borderRadius: '12px' }}
        />

        <button
            onClick={eliminarCompra}
            type="button"
            style={{ position: 'absolute', top: '270px', left: '550px', width: '200px', height: '40px', backgroundColor: "#FF4B4B", color: '#fff', borderRadius: '12px', border: 'none' }}
        >
            Eliminar Compra
        </button>



            
        </form>
    );
}

export default comprarAproveedor;
