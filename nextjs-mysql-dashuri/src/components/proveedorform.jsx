"use client"
import axios from "axios";
import { useRef, useState } from "react";


function proveedorform() {

    const [proveedor, setProveedor] = useState({
            nombre: "",
            telefono: "",
            correo: "",  
        });
    const form = useRef(null);

    const handleChange = ( e ) => {
        setProveedor({
            ...proveedor,
            [e.target.name]: e.target.value
        })
	}

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post("/api/ComprasProveedor", proveedor)
        console.log(res)
        form.current.reset();
    }


    return (
        <form 
        className="absolute bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4 w-[300px] h-[300px] top-[10px] left-[1185px]" //x máx 1195
        onSubmit={handleSubmit}
        ref={form}
        >
            
            <label 
            htmlFor="nombre"
            className="block text-gray-700 text-sm font-bold mb-2"
            >
                Nombre del proveedor: 
            </label>
            <input name="nombre" type="text" placeholder="nombre" onChange={handleChange} 
                className="shadow appearance-none border rounded w-full py-2 px-3"
            />

            <label htmlFor="tel"
            className="block text-gray-700 text-sm font-bold mb-2"
            >
                teléfono: 
            </label>
            <input name="telefono" type="text" placeholder="telefono"  onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
            />

            <label htmlFor="correo"
            className="block text-gray-700 text-sm font-bold mb-2"
            >
                correo: 
            </label>
            <input name="correo" type="text" placeholder="correo"  onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
            />

            <button style={{
            position: 'absolute',
            top: '245px',       // posición en Y
            left: '78px',      // posición en X
            width: '150px',     // ancho
            height: '40px',      // alto
            backgroundColor: "#6600A1",
            color: '#fff',
            borderRadius: '12px' // Bordes redondeados
            }}>
                Agregar Proveedor

            </button>

        </form>

        
    );
}

export default proveedorform;