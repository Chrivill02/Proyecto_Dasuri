'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';


export default function VentasPage() {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorDetails, setErrorDetails] = useState(null);
    const [esAdmin, setEsAdmin] = useState(false);

    // Verificar el nivel del usuario en localStorage
    useEffect(() => {
        const usuarioNivel = localStorage.getItem('usuarioNivel');
        if (usuarioNivel && parseInt(usuarioNivel) === 1) {
            setEsAdmin(true);
        } else {
            setEsAdmin(false);
        }
    }, []);

    const fetchVentas = async () => {
        try {
            setLoading(true);
            setError(null);
            setErrorDetails(null);
            
            const response = await fetch('/api/Ventas');
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || 
                    `Error HTTP ${response.status} al cargar las ventas`
                );
            }
            
            const data = await response.json();
            setVentas(Array.isArray(data) ? data : (data.data || []));
        } catch (err) {
            console.error('Error al cargar ventas:', err);
            setError(err.message);
            setErrorDetails({
                status: err.status,
                stack: process.env.NODE_ENV === 'development' ? err.stack : null
            });
        } finally {
            setLoading(false);
        }
    };

    const eliminarVenta = async (id) => {
        try {
            const response = await fetch('/api/Ventas', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            if (data.success) {
                setVentas(ventas.filter(venta => venta.id !== id));
            } else {
                alert(data.message || 'No se pudo eliminar la venta');
            }
        } catch (err) {
            console.error('Error al eliminar venta:', err);
            alert('Error al eliminar la venta');
        }
    };

    useEffect(() => {
        fetchVentas();
    }, []);

    if (!esAdmin) {
        return <p>No tienes acceso a esta página.</p>;
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Cargando datos de ventas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Error al cargar las ventas
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                                {errorDetails?.stack && (
                                    <details className="mt-2">
                                        <summary className="text-xs cursor-pointer">Detalles técnicos</summary>
                                        <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-x-auto">
                                            {errorDetails.stack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                <button
                    onClick={fetchVentas}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Reintentar
                </button>
            </div>
        );
    }

return (
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
    <Link href="/">
        <button className="inline-flex items-center px-3 py-2 border border-indigo-600 shadow-sm text-sm font-medium rounded-md text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            ← Inicio
        </button>
    </Link>
    <h1 className="text-2xl font-bold text-purple-700">Registro de reservas</h1>
</div>

<button
    onClick={fetchVentas}
    className="inline-flex items-center px-4 py-2 border border-blue-800 shadow-sm text-sm font-medium rounded-md text-white bg-purple-800 hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
>
    <svg className="-ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
    </svg>
    Actualizar
</button>

            </div>
            
            {ventas.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay ventas registradas</h3>
                    <p className="mt-1 text-sm text-gray-500">No se encontraron registros de ventas en la base de datos.</p>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Descripcion
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {ventas.map((venta) => (
                                    <tr key={venta.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{venta.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venta.usuario_nombre || 'Sin cliente'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venta.total}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venta.descripcion}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => eliminarVenta(venta.id)}
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
