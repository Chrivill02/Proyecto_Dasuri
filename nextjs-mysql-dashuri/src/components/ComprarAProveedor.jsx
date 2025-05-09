"use client"
import axios from "axios";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

function comprarAproveedor() {
    const [compraProveedor, setCompraProveedor] = useState({
        producto: "",
        cantidad: "",
        proveedor_id: "",
        fecha_vencimiento: ""
    });

    const form = useRef(null);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompraProveedor(prev => ({ ...prev, [name]: value }));
    };

    const agregarCompra = async () => {
        try {
            const response = await axios.post(`/api/inventario/${compraProveedor}`); // 🚀 Enviamos los datos a la API
            alert("Compra agregada con éxito.");
            console.log("Respuesta del servidor:", response.data);

            // Limpiar el formulario después de agregar la compra
            form.current.reset();
            setCompraProveedor({
                producto: "",
                cantidad: "",
                proveedor_id: "",
                fecha_vencimiento: ""
            });
        } catch (error) {
            console.error("Error al agregar la compra:", error);
            alert("Hubo un error al agregar la compra.");
        }
    };

    const irAgregarProveedor = () => {
        router.push("/agregarproveedor");
    };

    return (
        <form
            className="absolute bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4 w-[850px] h-[300px] top-[10px] left-[323px]"
            ref={form}
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
                onClick={agregarCompra}
                type="button"
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
        </form>
    );
}

export default comprarAproveedor;
