'use client';
import { useEffect, useState } from 'react';

export default function ProveedoresPage() {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');

    const fetchProveedores = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/proveedores');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error HTTP ${response.status}`);
            }

            const data = await response.json();
            setProveedores(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
            console.error('Error al cargar proveedores:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const agregarProveedor = async () => {
        if (!nombre || !correo) {
            alert('Nombre y correo son obligatorios');
            return;
        }

        try {
            const response = await fetch('/api/proveedores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, telefono, correo }),
            });

            const data = await response.json();
            if (data.success) {
                fetchProveedores();
                setNombre('');
                setTelefono('');
                setCorreo('');
            } else {
                alert(data.message || 'No se pudo agregar el proveedor');
            }
        } catch (err) {
            console.error('Error al agregar proveedor:', err);
            alert('Error al agregar proveedor');
        }
    };

    const eliminarProveedor = async (id) => {
        try {
            const response = await fetch('/api/proveedores', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (data.success) {
                setProveedores(proveedores.filter(prov => prov.id !== id));
            } else {
                alert(data.message || 'No se pudo eliminar el proveedor');
            }
        } catch (err) {
            console.error('Error al eliminar proveedor:', err);
            alert('Error al eliminar proveedor');
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, []);

    if (loading) {
        return <p>Cargando proveedores...</p>;
    }

    if (error) {
        return <p>Error al cargar proveedores: {error}</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold">Gestión de Proveedores</h1>

            <div className="mt-4">
                <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="border p-2 mr-2" />
                <input type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="border p-2 mr-2" />
                <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} className="border p-2 mr-2" />
                <button onClick={agregarProveedor} className="bg-blue-500 text-white px-4 py-2">Agregar</button>
            </div>

            <table className="mt-6 w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Nombre</th>
                        <th className="p-2 border">Teléfono</th>
                        <th className="p-2 border">Correo</th>
                        <th className="p-2 border">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {proveedores.map((prov) => (
                        <tr key={prov.id} className="border">
                            <td className="p-2 border">{prov.id}</td>
                            <td className="p-2 border">{prov.nombre}</td>
                            <td className="p-2 border">{prov.telefono || 'N/A'}</td>
                            <td className="p-2 border">{prov.correo}</td>
                            <td className="p-2 border">
                                <button onClick={() => eliminarProveedor(prov.id)} className="bg-red-500 text-white px-4 py-2">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
