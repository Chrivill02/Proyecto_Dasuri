"use client"
import axios from "axios";
import { useRef, useState } from "react";


function comprarAproveedor() {
    const [detallecompra, setDetalleCompra] = useState({
            compra_id: "",
            producto_id: "",
            cantidad: "",
            precio_unitario: "",
            sub_total: "",
            detalles: "",  
        });
    const form = useRef(null);


    const handleChange = async (e) => {
        const { name, value } = e.target;
    
        // Copia actual del estado
        let newDetalle = {
            ...detallecompra,
            [name]: value
        };
    
        // Si el campo cambiado es "producto_id", obtener precio desde API
        if (name === "producto_id") {
            try {
                const res = await fetch(`/api/producto/${value}`);
                const data = await res.json();
    
                if (data.precio) {
                    newDetalle.precio_unitario = data.precio;
                }
            } catch (error) {
                console.error("Error obteniendo el precio:", error);
            }
        }
    
        // Si se ingresan cantidad o precio, calcular sub_total
        if ((name === "cantidad" || name === "precio_unitario") && (newDetalle.cantidad && newDetalle.precio_unitario)) {
            newDetalle.sub_total = parseFloat(newDetalle.cantidad) * parseFloat(newDetalle.precio_unitario);
        }
    
        setDetalleCompra(newDetalle);
    };
    
        
    const guardarDetalleCompra = async () => {
        try {
            await axios.post("/api/inventario", detallecompra);
            alert("Detalle de compra guardado.");
            form.current.reset();
            setDetalleCompra({
                compra_id: "",
                producto_id: "",
                cantidad: "",
                precio_unitario: "",
                sub_total: "",
                detalles: "",
            });
        } catch (error) {
            console.error("Error al guardar detalle:", error);
        }
    };
    
    const terminarCompra = async () => {
        try {
            const response = await axios.get(`/api/factura/${detallecompra.compra_id}`);
            const compraActual = response.data;
    
            const nuevoTotal = Number(compraActual.total) + Number(detallecompra.sub_total);
    
            await axios.put(`/api/factura/${detallecompra.compra_id}`, {
                ...compraActual,
                total: nuevoTotal,
            });
    
            alert("Compra finalizada. Total actualizado.");
        } catch (error) {
            console.error("Error al actualizar la compra:", error);
        }
    };
    
    return (
        <form 
        className="absolute bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4 w-[850px] h-[300px] top-[10px] left-[323px]" //x máx 1195 y máx 441
        ref={form}
        >   

            <label 
            style={{
                position: 'absolute',
                top: '20px',       // posición en Y
                left: '20px',      // posición en X
                color: '#000',
                }}
            >
                # de Factura: 
            </label>
            <input
            onChange={handleChange}
            name="compra_id"
            type="text"
            placeholder="-->ID<--"
            style={{
                position: 'absolute',
                top: '50px',       // posición en Y
                left: '20px',      // posición en X
                width: '70px',     // ancho
                height: '40px',      // alto
                backgroundColor: "#6600A1",
                color: '#000',
                borderRadius: '12px' // Bordes redondeados
                }}
            
            />


            <label 
            style={{
                position: 'absolute',
                top: '110px',       // posición en Y
                left: '20px',      // posición en X
                //width: '150px',     // ancho
                //height: '40px',      // alto
                //  backgroundColor: "#6600A1",
                color: '#000',
                //borderRadius: '12px' // Bordes redondeados
                }}
            >
                ID del producto: 
            </label>
            <input
            type="text"
            placeholder="-->ID<--"
            onChange={handleChange}
            name="producto_id"
            style={{
                position: 'absolute',
                top: '140px',       // posición en Y
                left: '20px',      // posición en X
                width: '70px',     // ancho
                height: '40px',      // alto
                backgroundColor: "#6600A1",
                color: '#000',
                borderRadius: '12px' // Bordes redondeados
            }}

            />


            <label 
            htmlFor="cantidad"
            style={{
                position: 'absolute',
                top: '210px',       // posición en Y
                left: '20px',      // posición en X
                //width: '150px',     // ancho
                //height: '40px',      // alto
                //  backgroundColor: "#6600A1",
                color: '#000',
                //borderRadius: '12px' // Bordes redondeados
                }}
            >
                Cantidad: 
            </label>
            <input name="cantidad" type="text" placeholder="Cantidad" onChange={handleChange} 
                style={{
                    position: 'absolute',
                    top: '240px',       // posición en Y
                    left: '20px',      // posición en X
                    width: '110px',     // ancho
                    height: '40px',      // alto
                    backgroundColor: "#6600A1",
                    color: '#000',
                    borderRadius: '12px' // Bordes redondeados
                    }}
            />


            <label 
            htmlFor="preciounitario"
            style={{
                position: 'absolute',
                top: '20px',       // posición en Y
                left: '190px',      // posición en X
                //width: '150px',     // ancho
                //height: '40px',      // alto
                //  backgroundColor: "#6600A1",
                color: '#000',
                //borderRadius: '12px' // Bordes redondeados
                }}
            >
                Precio unitario: 
            </label>
            <input name="preciounitario" type="text" placeholder="Precio Unitario" value={detallecompra.precio_unitario} readOnly
                style={{
                    position: 'absolute',
                    top: '50px',       // posición en Y
                    left: '190px',      // posición en X
                    width: '110px',     // ancho
                    height: '40px',      // alto
                    backgroundColor: "#6600A1",
                    color: '#000',
                    borderRadius: '12px' // Bordes redondeados
                    }}
            />



            <label 
            htmlFor="subtotal"
            style={{
                position: 'absolute',
                top: '110px',       // posición en Y
                left: '190px',      // posición en X
                //width: '150px',     // ancho
                //height: '40px',      // alto
                //  backgroundColor: "#6600A1",
                color: '#000',
                //borderRadius: '12px' // Bordes redondeados
                }}
            >
                Sub-total: 
            </label>
            <input name="subtotal" type="text" placeholder="subtotal" value={detallecompra.sub_total} readOnly
                style={{
                    position: 'absolute',
                    top: '140px',       // posición en Y
                    left: '190px',      // posición en X
                    width: '110px',     // ancho
                    height: '40px',      // alto
                    backgroundColor: "#6600A1",
                    color: '#000',
                    borderRadius: '12px' // Bordes redondeados
                    }}
            />
            
            <button 
            onClick={guardarDetalleCompra}
            style={{
            position: 'absolute',
            top: '240px',       // posición en Y
            left: '190px',      // posición en X
            width: '100px',     // ancho
            height: '40px',      // alto
            backgroundColor: "#a74be3",
            color: '#000',
            borderRadius: '12px' // Bordes redondeados
            }}>
                aceptar

            </button>


            <button 
            onClick={terminarCompra}
            style={{
            position: 'absolute',
            top: '240px',       // posición en Y
            left: '650px',      // posición en X
            width: '150px',     // ancho
            height: '40px',      // alto
            backgroundColor: "#a74be3",
            color: '#000',
            borderRadius: '12px' // Bordes redondeados
            }}>
                Terminar compra

            </button>



            <label 
            htmlFor="dcompra"
            style={{
                position: 'absolute',
                top: '20px',       // posición en Y
                left: '350px',      // posición en X
                //width: '150px',     // ancho
                //height: '40px',      // alto
                //  backgroundColor: "#6600A1",
                color: '#000',
                //borderRadius: '12px' // Bordes redondeados
                }}
            >
                Detalles de la compra: 
            </label>
            <textarea name="dcompra" type="text" placeholder="Detalles de la compra" onChange={handleChange} 
                style={{
                    position: 'absolute',
                    top: '50px',       // posición en Y
                    left: '350px',      // posición en X
                    width: '450px',     // ancho
                    height: '150px',      // alto
                    backgroundColor: "#6600A1",
                    color: '#000',
                    resize: 'none',
                    borderRadius: '12px' // Bordes redondeados
                    }}
            />

        </form>
    );
}

export default comprarAproveedor;