"use client";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function ComprarAProveedor() {
    const [compra, setCompra] = useState({
        nombre: "",
        stock: "",
        categoria_id: "",
        fecha_exp: "",
        precio: ""
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

        const { nombre, stock, categoria_id, fecha_exp, precio } = compra;

        if (!nombre || !stock || !categoria_id || !fecha_exp || !precio) {
            alert("Debe llenar todos los campos.");
            return;
        }

        try {
            const datosParaAPI = {
                nombre,
                stock: Number(stock),
                categoria_id: Number(categoria_id),
                fecha_exp,
                precio: Number(precio)
            };

            const res = await axios.post("/api/inventario", datosParaAPI);
            alert("Producto registrado exitosamente.");
            
            form.current.reset();
            setCompra({
                nombre: "",
                stock: "",
                categoria_id: "",
                fecha_exp: "",
                precio: ""
            });
            
        } catch (error) {
            console.error("Error al registrar:", error);
            if (error.response) {
                alert(`Error: ${error.response.data.message || 'Verifica los datos'}`);
            } else {
                alert("Error de conexión con el servidor");
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

    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const res = await fetch('/api/categoria');
                const data = await res.json();
                setCategorias(data);
            } catch (error) {
                console.error('Error al cargar categorías', error);
            }
        };

        fetchCategorias();
    }, []);

    return (
        <form
            className="absolute bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4 w-[655px] h-[480px] top-[450px] left-[400px]"
            ref={form}
            onSubmit={handleSubmit}
        >
            <label style={{ position: 'absolute', top: '20px', left: '20px', color: '#000' }}>
                Producto:
            </label>
            <input
                onChange={handleChange}
                name="nombre"
                type="text"
                placeholder="Nombre del producto"
                value={compra.nombre}
                style={{ position: 'absolute', top: '50px', left: '20px', width: '200px', height: '40px', backgroundColor: "#6600A1", color: '#000', borderRadius: '12px' }}
            />

            <label style={{ position: 'absolute', top: '110px', left: '20px', color: '#000' }}>
                Cantidad:
            </label>
            <input
                type="number"
                placeholder="Cantidad"
                onChange={handleChange}
                name="stock"
                value={compra.stock}
                style={{ position: 'absolute', top: '140px', left: '20px', width: '100px', height: '40px', backgroundColor: "#6600A1", color: '#000', borderRadius: '12px' }}
            />

            <label style={{ position: 'absolute', top: '200px', left: '20px', color: '#000' }}>
                Precio:
            </label>
            <input
                type="number"
                placeholder="Precio"
                name="precio"
                onChange={handleChange}
                value={compra.precio}
                style={{ position: 'absolute', top: '230px', left: '20px', width: '100px', height: '40px', backgroundColor: "#6600A1", color: '#000', borderRadius: '12px' }}
            />

            <label htmlFor="fecha_exp" style={{ position: 'absolute', top: '110px', left: '300px', color: '#000' }}>
                Fecha de vencimiento:
            </label>
            <input
                name="fecha_exp"
                type="date"
                onChange={handleChange}
                value={compra.fecha_exp}
                style={{ position: 'absolute', top: '140px', left: '300px', width: '180px', height: '40px', backgroundColor: "#6600A1", color: '#000', borderRadius: '12px' }}
            />

            <label style={{ position: 'absolute', top: '200px', left: '300px', color: '#000' }}>
                Categoría:
            </label>
            <select
                name="categoria_id"
                onChange={handleChange}
                value={compra.categoria_id}
                style={{ position: 'absolute', top: '230px', left: '300px', width: '180px', height: '40px', backgroundColor: "#6600A1", color: '#123', borderRadius: '12px' }}
            >
                <option value="">Seleccione categoría</option>
                {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                    </option>
                ))}
            </select>

            <button
                type="submit"
                style={{ position: 'absolute', top: '300px', left: '170px', width: '150px', height: '40px', backgroundColor: "#a74be3", color: '#000', borderRadius: '12px' }}
            >
                Realizar Compra
            </button>

            <button
                onClick={irAgregarProveedor}
                type="button"
                style={{ position: 'absolute', top: '30px', left: '530px', width: '110px', height: '50px', backgroundColor: "#6600A1", color: '#fff', borderRadius: '12px', border: 'none' }}
            >
                ➡️ Registrar proveedor
            </button>

            <label style={{ position: 'absolute', top: '360px', left: '100px', color: '#000' }}>
                ID a eliminar:
            </label>
            <input
                type="text"
                placeholder=" -> ID <-"
                value={eliminarIdONombre}
                onChange={(e) => setEliminarIdONombre(e.target.value)}
                style={{ position: 'absolute', top: '390px', left: '110px', width: '70px', height: '40px', backgroundColor: "#6600A1", color: '#000', borderRadius: '12px' }}
            />

            <button
                onClick={eliminarCompra}
                type="button"
                style={{ position: 'absolute', top: '390px', left: '230px', width: '170px', height: '40px', backgroundColor: "#A10000", color: '#fff', borderRadius: '12px', border: 'none' }}
            >
                🗑️ Eliminar Compra
            </button>
        </form>
    );
}

export default ComprarAProveedor;