"use client";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function ComprarAProveedor() {
    const [compra, setCompra] = useState({
        producto: "",
        cantidad: "",
        categoria_id: "",
        fecha_vencimiento: "",
        precio: "",
        proveedor_id: ""
    });

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [eliminarIdONombre, setEliminarIdONombre] = useState("");
    
    const form = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productosRes, categoriasRes, proveedoresRes] = await Promise.all([
                    fetch('/api/inventario'),
                    fetch('/api/categoria'),
                    fetch('/api/ComprasProveedor')
                ]);
                const productosData = await productosRes.json();
                const categoriasData = await categoriasRes.json();
                const proveedoresData = await proveedoresRes.json();

                setProductos(productosData);
                setCategorias(categoriasData);
                setProveedores(proveedoresData);
            } catch (error) {
                console.error("Error al cargar datos", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setCompra({
            ...compra,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { producto, cantidad, precio, categoria_id, proveedor_id, fecha_vencimiento } = compra;

        if (!producto || !cantidad || !precio ||!categoria_id || !proveedor_id || !fecha_vencimiento ) {
            alert("Debe llenar todos los campos.");
            return;
        }

        try {
            const datosParaAPI = {
                producto,
                cantidad: Number(cantidad),
                categoria_id: Number(categoria_id),
                fecha_vencimiento,
                precio: Number(precio),
                proveedor_id: Number(proveedor_id)
            };

            await axios.post("/api/solicitud", datosParaAPI);
            alert("Producto registrado exitosamente.");

            form.current.reset();
            setCompra({
                producto: "",
                cantidad: "",
                precio: "",
                categoria_id: "",
                proveedor_id: "",
                fecha_vencimiento: "",
            });
        } catch (error) {
            console.error("Error al registrar:", error);
            alert("Error al registrar la solicitud.");
        }
    };

    const eliminarCompra = async () => {
    if (!eliminarIdONombre || isNaN(eliminarIdONombre)) {
        alert("Debe ingresar un ID numérico para eliminar.");
        return;
    }

    try {
        const res = await axios.delete(`/api/solicitud/${eliminarIdONombre}`);
        alert(res.data.message);
        setEliminarIdONombre("");

        // Opcional: actualizar estados locales si tienes datos cargados
        setProductos(prev => prev.filter(p => p.id !== Number(eliminarIdONombre)));
        setProveedores(prev => prev.filter(p => p.id !== Number(eliminarIdONombre)));
        // Ajusta según qué datos sean afectados por la eliminación
    } catch (error) {
        console.error("Error al eliminar la compra:", error);
        alert("Error al eliminar la compra.");
    }
};

    const irAgregarProveedor = () => {
        router.push("/agregarproveedor");
    };

    const irFacturas = () => {
        router.push("/facturasenviadas");
    };

    return (
        <div className="absolute top-[450px] left-[400px] w-[720px]">
            <form
                ref={form}
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-2xl px-10 py-8 space-y-5"
            >
                <div className="flex space-x-5">
                {/* Select de producto */}
                <div className="flex-1">
                    <label className="text-black block mb-1">Producto:</label>
                    <select
                    name="producto"
                    value={compra.producto}
                    onChange={handleChange}
                    className="w-full h-10 rounded-xl px-3 bg-purple-200 text-black"
                    >
                    <option value="">Seleccione un producto</option>
                    {productos.map((producto) => (
                        <option key={producto.id} value={producto.nombre}>
                        {producto.nombre}
                        </option>
                    ))}
                    </select>
                </div>

                {/* Select de proveedor */}
                <div className="flex-1">
                    <label className="text-black block mb-1">Proveedor:</label>
                    <select
                    name="proveedor_id"
                    value={compra.proveedor_id}
                    onChange={handleChange}
                    className="w-full h-10 rounded-xl px-3 bg-purple-200 text-black"
                    >
                    <option value="">Seleccione un proveedor</option>
                    {proveedores.map((proveedor) => (
                        <option key={proveedor.id} value={proveedor.id}>
                        {proveedor.nombre}
                        </option>
                    ))}
                    </select>
                </div>
                </div>



                {/* Cantidad y Precio */}
                <div className="flex space-x-5">
                    <div className="flex-1">
                        <label className="text-black block mb-1">Cantidad:</label>
                        <input
                            type="number"
                            name="cantidad"
                            value={compra.cantidad}
                            onChange={handleChange}
                            placeholder="Cantidad"
                            className="w-full h-10 rounded-xl px-3 bg-purple-200 text-black"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-black block mb-1">Precio:</label>
                        <input
                            type="number"
                            name="precio"
                            value={compra.precio}
                            onChange={handleChange}
                            placeholder="Precio"
                            className="w-full h-10 rounded-xl px-3 bg-purple-200 text-black"
                        />
                    </div>
                </div>

                {/* Fecha y Categoría */}
                <div className="flex space-x-5">
                    <div className="flex-1">
                        <label className="text-black block mb-1">Fecha de vencimiento:</label>
                        <input
                            type="date"
                            name="fecha_vencimiento"
                            value={compra.fecha_vencimiento}
                            onChange={handleChange}
                            className="w-full h-10 rounded-xl px-3 bg-purple-200 text-black"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-black block mb-1">Categoría:</label>
                        <select
                            name="categoria_id"
                            value={compra.categoria_id}
                            onChange={handleChange}
                            className="w-full h-10 rounded-xl px-3 bg-purple-200 text-black"
                        >
                            <option value="">Seleccione categoría</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex flex-wrap justify-between items-center mt-4 space-y-3">
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-600 text-white px-6 py-2 rounded-xl"
                    >
                        ✅ Realizar Compra
                    </button>

                    <button
                        onClick={irAgregarProveedor}
                        type="button"
                        className="bg-orange-500 hover:bg-orange-500 text-black px-5 py-2 rounded-xl border border-orange-500"
                    >
                        ➕ Registrar proveedor
                    </button>

                    <button
                        onClick={irFacturas}
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl"
                    >
                        📄 Ver facturas
                    </button>
                </div>

                {/* Eliminar por ID */}
                <div className="mt-6 flex items-center space-x-4">
                    <label className="text-black">ID a eliminar:</label>
                    <input
                        type="text"
                        value={eliminarIdONombre}
                        onChange={(e) => setEliminarIdONombre(e.target.value)}
                        placeholder="ID"
                        className="w-24 h-10 rounded-xl px-3 bg-purple-200 text-black"
                    />
                    <button
                        onClick={eliminarCompra}
                        type="button"
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl"
                    >
                        🗑️ Eliminar Solicitud
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ComprarAProveedor;
