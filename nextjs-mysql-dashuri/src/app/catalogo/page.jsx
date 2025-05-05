'use client';
import { useEffect, useState } from 'react';

export default function CatalogoPage() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al cargar productos:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-10 text-purple-700">
        Catálogo de Productos
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productos.map(producto => (
          <div
            key={producto.id}
            className="bg-white rounded-2xl shadow-md p-5 transform hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            <div className="h-32 bg-gradient-to-r from-purple-200 to-purple-100 rounded-xl mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800">{producto.nombre}</h2>
            <p className="text-purple-700 font-bold text-lg">Q{producto.precio}</p>
            <p className="text-sm text-gray-500">Stock: {producto.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
