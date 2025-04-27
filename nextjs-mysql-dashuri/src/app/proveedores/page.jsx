'use client';
import { useEffect, useState } from 'react';

export default function ProveedoresPage() {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorDetails, setErrorDetails] = useState(null);

    const fetchProveedores = async () => {
        try {
            setLoading(true);
            setError(null);
            setErrorDetails(null);

            const response = await fetch('/api/proveedores');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || 
                    `Error HTTP ${response.status} al cargar los proveedores`
                );
            }

            const data = await response.json();
            setProveedores(Array.isArray(data) ? data : (data.data || []));
        } catch (err) {
            console.error('Error al cargar proveedores:', err);
            setError(err.message);
            setErrorDetails({
                status: err.status,
                stack: process.env.NODE_ENV === 'development' ? err.stack : null
            });
        } finally {
            setLoading(false);
        }
    };

    const eliminarProveedor = async (id) => {
        try {
            const response = await fetch('/api/proveedores', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
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
            alert('Error al eliminar el proveedor');
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Cargando datos de proveedores...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <h3 className="text-sm font-medium text-red-800">Error al cargar los proveedores</h3>
                    <p className="text-sm text-red-700">{error}</p>
                    {errorDetails?.stack && (
                        <details className="mt-2">
                            <summary className="text-xs cursor-pointer">Detalles técnicos</summary>
                            <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-x-auto">
                                {errorDetails.stack}
                            </pre>
                        </details>
                    )}
                </div>
                <button
                    onClick={fetchProveedores}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-blue">Proveedores</h1>
                <button
                    onClick={fetchProveedores}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    Actualizar
                </button>
            </div>

            {proveedores.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-6 text-center">
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay proveedores registrados</h3>
                    <p className="mt-1 text-sm text-gray-500">No se encontraron registros de proveedores en la base de datos.</p>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {proveedores.map((prov) => (
                                    <tr key={prov.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{prov.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{prov.nombre}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{prov.empresa}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{prov.telefono}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{prov.correo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => eliminarProveedor(prov.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
