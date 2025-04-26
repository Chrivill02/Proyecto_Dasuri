"use client"
import axios from "axios";
import { useRef, useState } from "react";


function mostrartablas() {

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
        className="absolute bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4 w-[1000px] h-[400px] top-[325px] left-[170px]" //x máx 1195 y máx 441
        onSubmit={handleSubmit}
        ref={form}
        >
            <label 
            htmlFor="Aqui se van a mostrar las tablas"
            className="block text-gray-700 text-sm font-bold mb-2"
            >
                Aqui se van a mostrar las tablas
            </label>

        </form>

        
    );
}

export default mostrartablas;