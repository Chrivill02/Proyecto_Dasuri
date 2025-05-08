'use client';
import { useEffect, useState } from 'react';

export default function CatalogoPage() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('/api/catalogo')
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
            <img
            src={producto.imagen_url || 'https://placehold.co/300x160?text=Sin+Imagen'}
            alt={producto.nombre}
            className="w-full h-40 object-contain rounded-xl mb-4 bg-white"
          />

            <h2 className="text-xl font-semibold text-gray-800">{producto.nombre}</h2>
            <p className="text-purple-700 font-bold text-lg">Q{producto.precio}</p>
            <p className="text-sm text-gray-500">Stock: {producto.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
