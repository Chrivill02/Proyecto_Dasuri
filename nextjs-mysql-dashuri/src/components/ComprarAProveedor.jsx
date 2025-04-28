"use client"
import axios from "axios";
import { useRef, useState, useEffect } from "react";


function comprarAproveedor() {
    const [options, setOptions] = useState([]);
    const [compraDetails, setCompraDetails] = useState(null);

    const [detallecompra, setDetalleCompra] = useState({
            compra_id: "",
            producto_id: "",
            cantidad: "",
            precio_unitario: "",
            sub_total: "",
            detalles: "",  
        });
    const form = useRef(null);

    const handleChange = ( e ) => {
        setDetalleCompra({
            ...detallecompra,
            [e.target.name]: e.target.value
        })

        if (e.target.name === "compra_id" && e.target.value) {
            fetchCompraDetails(e.target.value);
        } else if (e.target.name === "compra_id" && !e.target.value) {
            setCompraDetails(null);
        } 
	}

    const fetchCompraDetails = async (id) => {
        try {
            // Primero intentamos buscar en los datos ya cargados
            const selectedCompra = options.find(option => option.id.toString() === id.toString());
            
            if (selectedCompra) {
                setCompraDetails(selectedCompra);
            } else {
                // Si no está en los datos cargados, hacemos una petición específica
                const response = await fetch(`/api/solicitud/${id}`);
                const data = await response.json();
                setCompraDetails(data);
            }
        } catch (error) {
            console.error("Error obteniendo detalles de la compra:", error);
            setCompraDetails(null);
        }
    };



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
        setProveedorDetails(null);
    }

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
        className="absolute bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4 w-[850px] h-[300px] top-[10px] left-[323px]" //x máx 1195 y máx 441
        onSubmit={handleSubmit}
        ref={form}
        >   

            <label 
            htmlFor="ID_compra"
            style={{
                position: 'absolute',
                top: '20px',       // posición en Y
                left: '20px',      // posición en X
                color: '#fff',
                }}
            >
                ID de la Solicitud: 
            </label>
            <input
            onChange={handleChange}
            name="compra_id"
            type="text"
            placeholder="ID"
            style={{
                position: 'absolute',
                top: '50px',       // posición en Y
                left: '20px',      // posición en X
                width: '70px',     // ancho
                height: '40px',      // alto
                backgroundColor: "#6600A1",
                color: '#fff',
                borderRadius: '12px' // Bordes redondeados
                }}
            
            />

            <label 
            htmlFor="dcompra"
            style={{
                position: 'absolute',
                top: '110px',       // posición en Y
                left: '20px',      // posición en X
                color: '#fff',
                }}
            >
                Descripción: 
            </label>
            {compraDetails && (
                <div
                style={{
                    position: 'absolute',
                    top: '140px',       // posición en Y
                    left: '20px',      // posición en X
                    width: '200px',     // ancho
                    height: '150px',      // alto
                    backgroundColor: "#6600A1",
                    color: '#fff',
                    resize: 'none',
                    borderRadius: '12px' // Bordes redondeados
                    }}
            >
                <p><strong>ID:</strong> {compraDetails.id}</p>
                <p><strong>Nombre:</strong> {compraDetails.fecha || compraDetails.fecha || "N/A"}</p>
                <p><strong>Teléfono:</strong> {compraDetails.total || compraDetails.total || "N/A"}</p>
                <p><strong>Correo:</strong> {compraDetails.proveedor_id || compraDetails.proveedor_id || "N/A"}</p>

            </div>)}



            
            <label 
            htmlFor="IDsolicitud"
            style={{
                position: 'absolute',
                top: '20px',       // posición en Y
                left: '250px',      // posición en X
                //width: '150px',     // ancho
                //height: '40px',      // alto
                //  backgroundColor: "#6600A1",
                color: '#fff',
                //borderRadius: '12px' // Bordes redondeados
                }}
            >
                ID de la solicitud: 
            </label>
            <input
            type="text"
            placeholder="ID"
            onChange={handleChange}
            name="proveedor_id"
            style={{
                position: 'absolute',
                top: '50px',       // posición en Y
                left: '250px',      // posición en X
                width: '70px',     // ancho
                height: '40px',      // alto
                backgroundColor: "#6600A1",
                color: '#fff',
                borderRadius: '12px' // Bordes redondeados
            }}

            />


            <label 
            htmlFor="dsolicitud"
            style={{
                position: 'absolute',
                top: '110px',       // posición en Y
                left: '250px',      // posición en X
                color: '#fff',
                }}
            >
                Descripción: 
            </label>
            {compraDetails && (
                <div
                style={{
                    position: 'absolute',
                    top: '140px',       // posición en Y
                    left: '250px',      // posición en X
                    width: '200px',     // ancho
                    height: '150px',      // alto
                    backgroundColor: "#6600A1",
                    color: '#fff',
                    resize: 'none',
                    borderRadius: '12px' // Bordes redondeados
                    }}
            >
                <p><strong>ID:</strong> {compraDetails.id}</p>
                <p><strong>Fecha:</strong> {compraDetails.fecha || compraDetails.fecha || "N/A"}</p>
                <p><strong>Total:</strong> {compraDetails.total || compraDetails.total || "N/A"}</p>
                <p><strong>ID proveedor:</strong> {compraDetails.proveedor_id || compraDetails.proveedor_id || "N/A"}</p>

            </div>)}



            <label 
            htmlFor="cantidad"
            style={{
                position: 'absolute',
                top: '20px',       // posición en Y
                left: '480px',      // posición en X
                //width: '150px',     // ancho
                //height: '40px',      // alto
                //  backgroundColor: "#6600A1",
                color: '#fff',
                //borderRadius: '12px' // Bordes redondeados
                }}
            >
                Cantidad: 
            </label>
            <input name="cantidad" type="text" placeholder="Cantidad" onChange={handleChange} 
                style={{
                    position: 'absolute',
                    top: '50px',       // posición en Y
                    left: '480px',      // posición en X
                    width: '110px',     // ancho
                    height: '40px',      // alto
                    backgroundColor: "#6600A1",
                    color: '#fff',
                    borderRadius: '12px' // Bordes redondeados
                    }}
            />


            <label 
            htmlFor="preciounitario"
            style={{
                position: 'absolute',
                top: '110px',       // posición en Y
                left: '480px',      // posición en X
                //width: '150px',     // ancho
                //height: '40px',      // alto
                //  backgroundColor: "#6600A1",
                color: '#fff',
                //borderRadius: '12px' // Bordes redondeados
                }}
            >
                Precio unitario: 
            </label>
            <input name="preciounitario" type="text" placeholder="Precio Unitario" onChange={handleChange} 
                style={{
                    position: 'absolute',
                    top: '140px',       // posición en Y
                    left: '480px',      // posición en X
                    width: '110px',     // ancho
                    height: '40px',      // alto
                    backgroundColor: "#6600A1",
                    color: '#fff',
                    borderRadius: '12px' // Bordes redondeados
                    }}
            />



            <label 
            htmlFor="subtotal"
            style={{
                position: 'absolute',
                top: '20px',       // posición en Y
                left: '680px',      // posición en X
                //width: '150px',     // ancho
                //height: '40px',      // alto
                //  backgroundColor: "#6600A1",
                color: '#fff',
                //borderRadius: '12px' // Bordes redondeados
                }}
            >
                Sub-total: 
            </label>
            <input name="subtotal" type="text" placeholder="subtotal" onChange={handleChange} 
                style={{
                    position: 'absolute',
                    top: '50px',       // posición en Y
                    left: '680px',      // posición en X
                    width: '110px',     // ancho
                    height: '40px',      // alto
                    backgroundColor: "#6600A1",
                    color: '#fff',
                    borderRadius: '12px' // Bordes redondeados
                    }}
            />


            <label 
            htmlFor="dcompra"
            style={{
                position: 'absolute',
                top: '110px',       // posición en Y
                left: '650px',      // posición en X
                //width: '150px',     // ancho
                //height: '40px',      // alto
                //  backgroundColor: "#6600A1",
                color: '#fff',
                //borderRadius: '12px' // Bordes redondeados
                }}
            >
                Detalles de la compra: 
            </label>
            <textarea name="dcompra" type="text" placeholder="Detalles de la compra" onChange={handleChange} 
                style={{
                    position: 'absolute',
                    top: '140px',       // posición en Y
                    left: '630px',      // posición en X
                    width: '200px',     // ancho
                    height: '150px',      // alto
                    backgroundColor: "#6600A1",
                    color: '#fff',
                    resize: 'none',
                    borderRadius: '12px' // Bordes redondeados
                    }}
            
            />

            
            <button style={{
            position: 'absolute',
            top: '245px',       // posición en Y
            left: '465px',      // posición en X
            width: '150px',     // ancho
            height: '40px',      // alto
            backgroundColor: "#a74be3",
            color: '#fff',
            borderRadius: '12px' // Bordes redondeados
            }}>
                Realizar Compra

            </button>

        </form>
        
    );
}

export default comprarAproveedor;