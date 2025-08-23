'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CatalogoPage() {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [usuarioId, setUsuarioId] = useState(null);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);
  const [bitacora, setBitacora] = useState([]);

  // 🔹 Registrar evento en bitácora
  const registrarEnBitacora = async (accion, detalle, estado = "pendiente") => {
  const evento = {
    fecha: new Date().toISOString(),
    usuarioId,
    accion,
    detalle,
    estado,
  };

  // Guardar localmente
  setBitacora((prev) => [...prev, evento]);
  console.log("📒 Bitácora:", evento);

  // Guardar en la BD
  try {
    await fetch("/api/bitacora", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario_id: usuarioId,
        accion,
        detalle,
        estado,
        fecha: evento.fecha,
      }),
    });
  } catch (error) {
    console.error("❌ Error al registrar en BD:", error);
  }
};


  useEffect(() => {
    // Verificar usuario
    if (typeof window !== 'undefined') {
      const id =
        localStorage.getItem('usuarioId') ||
        localStorage.getItem('userId') ||
        localStorage.getItem('idUsuario');

      if (id) {
        setUsuarioId(Number(id));
      }
      setCargandoUsuario(false);
    }

    // Cargar productos
    fetch('/api/catalogo')
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error('Error al cargar productos:', err));
  }, []);

  const handleCantidadChange = (productoId, value) => {
    const cantidad = parseInt(value) || 0;
    const producto = productos.find((p) => p.id === productoId);

    if (producto && cantidad >= 0 && cantidad <= producto.stock) {
      setCantidades((prev) => ({
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
    const producto = productos.find((p) => p.id === productoId);

    if (!producto || cantidad <= 0 || cantidad > producto.stock) {
      alert('Cantidad no válida');
      return;
    }

    if (!usuarioId) {
      alert(
        'Debes iniciar sesión para reservar productos. Por favor, recarga la página después de iniciar sesión.'
      );
      console.log('Contenido de localStorage:', { ...localStorage });
      return;
    }

    try {
      const descripcion = `Reserva de ${cantidad} ${producto.nombre}`;
      const total = producto.precio * cantidad;

      // 🔹 Registrar intento (punto de recuperación antes del envío)
      registrarEnBitacora("Intento de reserva", {
        productoId,
        cantidad,
        total,
      }, "en_proceso");

      registrarEnBitacora("Reserva confirmada", {
        productoId,
        cantidad,
        total,
      }, "exitoso");

      const response = await fetch('/api/Ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: usuarioId,
          total,
          descripcion,
          producto_id: productoId,
          cantidad,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 🔹 Registrar éxito
        registrarEnBitacora("Reserva confirmada", {
          productoId,
          cantidad,
          ventaId: data.id,
        });

        alert('Reserva realizada con éxito');
        setProductos((prev) =>
          prev.map((p) =>
            p.id === productoId ? { ...p, stock: p.stock - cantidad } : p
          )
        );
        setCantidades((prev) => ({ ...prev, [productoId]: 0 }));
      } else {
        throw new Error(data.message || 'Error al realizar la reserva');
      }
    } catch (error) {
      // 🔹 Registrar error
      registrarEnBitacora("Error en reserva", { error: error.message });
      console.error('Error al reservar:', error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <Link href="/">
        <button className="inline-flex items-center px-3 py-2 border border-indigo-600 shadow-sm text-sm font-medium rounded-md text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4">
          ← Inicio
        </button>
      </Link>
      <h1 className="text-3xl font-bold text-center mb-10 text-purple-700">
        Catálogo de Productos
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="bg-white rounded-2xl shadow-md p-5 transform hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            <img
              src={
                producto.imagen_url ||
                'https://placehold.co/300x160?text=Sin+Imagen'
              }
              alt={producto.nombre}
              className="w-full h-40 object-contain rounded-xl mb-4 bg-white"
            />

            <h2 className="text-xl font-semibold text-gray-800">
              {producto.nombre}
            </h2>
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
                    onChange={(e) =>
                      handleCantidadChange(producto.id, e.target.value)
                    }
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

      {/* 🔹 Mostrar bitácora para debug */}
      <div className="mt-10 bg-white rounded-xl shadow-md p-5">
        <h2 className="text-2xl font-bold mb-3 text-purple-700">📒 Bitácora</h2>
        <ul className="text-sm text-gray-700 space-y-2 max-h-60 overflow-y-auto">
          {bitacora.map((evento, index) => (
            <li key={index}>
              <strong>{evento.fecha}:</strong> {evento.accion} →{' '}
              <pre className="inline bg-gray-100 rounded px-2 py-1">
                {JSON.stringify(evento.detalle)}
              </pre>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
