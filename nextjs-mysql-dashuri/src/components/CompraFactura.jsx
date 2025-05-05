"use client"
import axios from "axios";
import { useRef, useState, useEffect } from "react";


function comprasform() {

    const [compra, setCompras] = useState({
            fecha: "",
            total: 0,
            proveedor_id: "",  
        });
    const form = useRef(null);


    const handleChange = ( e ) => {
        setCompras({
            ...compra,
            [e.target.name]: e.target.value
        })
	}


    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post("/api/factura", compra)
        console.log(res)
        form.current.reset();
        setCompras({
            fecha: "",
            total: 0,
            proveedor_id: "",
        });
    }    




    return (
        <form 
        className="absolute bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4 w-[300px] h-[300px] top-[10px] left-[10px]" //x máx 1195
        onSubmit={handleSubmit}
        ref={form}
        >

            <label 
            htmlFor="dcompra"
            style={{
                position: 'absolute',
                top: '15px',       // posición en Y
                left: '200px',      // posición en X
                color: '#000',
                }}
            >
               FACTURA 
            </label>
            


            <label 
            htmlFor=""
            className="block text-gray-700 text-sm font-bold mb-2"
            >
                ID de factura: 
            </label>
            <label 
            htmlFor=""
            className="block text-gray-700 text-sm font-bold mb-2"
            >
                #Cargando...
            </label>




            <label 
            htmlFor="fecha"
            className="block text-gray-700 text-sm font-bold mb-2"
            >
                Fecha: 
            </label>
            <input 
            type="date"
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2"
            name="fecha"  
            />
            

            <label htmlFor="proveedor_id"
            className="block text-gray-700 text-sm font-bold mb-2"
            onChange={handleChange}
            >
                ID del proveedor: 
            </label>
            
            <input name="proveedor_id" type="text" placeholder="-->ID<--" onChange={handleChange} 
            style={{
                position: 'absolute',
                top: '190px',       // posición en Y
                left: '30px',      // posición en X
                width: '70px',     // ancho
                height: '40px',      // alto
                backgroundColor: "#6600A1",
                color: '#fff',
                borderRadius: '12px' // Bordes redondeados
                }}
            ></input>


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
                Agregar Factura

            </button>

        </form>

        
    );
}

export default comprasform;