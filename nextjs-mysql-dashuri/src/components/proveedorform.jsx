"use client"
import { useState } from "react";

function proveedorform() {


    const [proveedor, setProveedor] = useState({
            nombre : "",
            tel: "",
            correo: "",  
        });


    const handleChange = ( e ) => {
		console.log(e);
	}


    return (
        <form className="bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4">

            <label htmlFor="nombre">Nombre del proveedor: </label>
            <input type="text" placeholder="nombre" onChange={handleChange} />

            <label htmlFor="tel">teléfono: </label>
            <input type="text" placeholder="tel"  onChange={handleChange}/>

            <label htmlFor="correo">correo: </label>
            <input type="text" placeholder="correo"  onChange={handleChange}/>

        </form>
    );
}

export default proveedorform