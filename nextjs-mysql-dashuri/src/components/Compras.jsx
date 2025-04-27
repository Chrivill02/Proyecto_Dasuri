"use client"
import axios from "axios";
import { useRef, useState, useEffect } from "react";



function comprasform() {
    const [options, setOptions] = useState([]);

    const [compra, setCompras] = useState({
            fecha: "",
            total: "",
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
        const res = await axios.post("/api/solicitud", compra)
        console.log(res)
        form.current.reset();
        setCompras({
            fecha: "",
            total: "",
            proveedor_id: "",
        });
    }

    const handleChange2 = (e) => {
        setSelectedOption(e.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {

            const response = await fetch('api/ComprasProveedor');
            const data = await response.json();

            setOptions(data);
          };
      
          fetchData();
        }, []);


    return (
        <form 
        className="absolute bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4 w-[300px] h-[300px] top-[10px] left-[10px]" //x máx 1195
        onSubmit={handleSubmit}
        ref={form}
        >
            
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

            <label htmlFor="total"
            className="block text-gray-700 text-sm font-bold mb-2"
            >
                Total: 
            </label><input name="total" type="text" placeholder="Total"  onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3"
            />
            

            <label htmlFor="proveedor_id"
            className="block text-gray-700 text-sm font-bold mb-2"
            onChange={handleChange}
            >
                ID del proveedor: 
            </label>
            
            <select
            value={compra.proveedor_id}
            onChange={handleChange}
            name="proveedor_id"
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
            >
                <option value="">-- ID --</option>
                {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.id}
                </option>
              ))}
            </select>


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
                Agregar Solicitud

            </button>

        </form>

        
    );
}

export default comprasform;