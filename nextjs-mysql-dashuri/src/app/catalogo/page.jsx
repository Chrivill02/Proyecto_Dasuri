'use client';
import { useEffect, useState } from 'react';

export default function CatalogoPage() {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [usuarioId, setUsuarioId] = useState(null);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);

  useEffect(() => {
    // Verificar el usuario en el cliente
    if (typeof window !== 'undefined') {
      // Intentar con varias keys comunes donde podría estar el ID
      const id = localStorage.getItem('usuarioId') || 
                 localStorage.getItem('userId') || 
                 localStorage.getItem('idUsuario');
      
      if (id) {
        setUsuarioId(Number(id));
      }
      setCargandoUsuario(false);
    }

    // Cargar productos
    fetch('/api/catalogo')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al cargar productos:', err));
  }, []);

  const handleCantidadChange = (productoId, value) => {
    const cantidad = parseInt(value) || 0;
    const producto = productos.find(p => p.id === productoId);
    
    if (producto && cantidad >= 0 && cantidad <= producto.stock) {
      setCantidades(prev => ({
        ...prev,
        [productoId]: cantidad
      }));
    }
  };

  const reservarProducto = async (productoId) => {
    if (cargandoUsuario) {
      alert('Esperando verificación de usuario...');
      return;
    }

    const cantidad = cantidades[productoId] || 0;
    const producto = productos.find(p => p.id === productoId);

    if (!producto || cantidad <= 0 || cantidad > producto.stock) {
      alert('Cantidad no válida');
      return;
    }

    if (!usuarioId) {
      alert('Debes iniciar sesión para reservar productos. Por favor, recarga la página después de iniciar sesión.');
      console.log('Contenido de localStorage:', { ...localStorage });
      return;
    }

    try {
      const descripcion = `Reserva de ${cantidad} ${producto.nombre}`;
      const total = producto.precio * cantidad;

      const response = await fetch('/api/Ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: usuarioId,
          total: total,
          descripcion: descripcion
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Reserva realizada con éxito');
        setProductos(prev => prev.map(p => 
          p.id === productoId ? {...p, stock: p.stock - cantidad} : p
        ));
        setCantidades(prev => ({...prev, [productoId]: 0}));
      } else {
        throw new Error(data.message || 'Error al realizar la reserva');
      }
    } catch (error) {
      console.error('Error al reservar:', error);
      alert(error.message);
    }
  };

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
            
            {producto.stock > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad a reservar:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max={producto.stock}
                    value={cantidades[producto.id] || 0}
                    onChange={(e) => handleCantidadChange(producto.id, e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    onClick={() => reservarProducto(producto.id)}
                    disabled={!cantidades[producto.id] || cantidades[producto.id] <= 0}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reservar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}