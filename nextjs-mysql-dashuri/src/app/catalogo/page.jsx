'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CatalogoPage() {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [usuarioId, setUsuarioId] = useState(null);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);

  // 🔹 Estados de bitácora y reservas
  const [bitacora, setBitacora] = useState([]);
  const [reservando, setReservando] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [reservas, setReservas] = useState([]);
  const [mostrarReservas, setMostrarReservas] = useState(false);

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
    const cargarProductos = async () => {
      try {
        const response = await fetch('/api/catalogo');
        if (!response.ok) throw new Error('Error al cargar productos');
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setMensaje('Error al cargar productos');
      }
    };

    cargarProductos();
  }, []);

  const cargarReservas = async () => {
    if (!usuarioId) return;

    try {
      const response = await fetch(`/api/reservas?usuario_id=${usuarioId}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setReservas(data);
      } else if (data && Array.isArray(data.reservas)) {
        setReservas(data.reservas);
      } else if (data) {
        setReservas([data]);
      } else {
        setReservas([]);
      }
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      setMensaje('Error al cargar reservas');
      setReservas([]);
    }
  };

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
      setMensaje('Esperando verificación de usuario...');
      return;
    }

    const cantidad = cantidades[productoId] || 0;
    const producto = productos.find((p) => p.id === productoId);

    if (!producto || cantidad <= 0) {
      setMensaje('Por favor selecciona una cantidad válida');
      return;
    }

    if (cantidad > producto.stock) {
      setMensaje('No hay suficiente stock disponible');
      return;
    }

    if (!usuarioId) {
      setMensaje('Debes iniciar sesión para reservar productos');
      return;
    }

    // Iniciar estado de reserva
    setReservando(prev => ({ ...prev, [productoId]: true }));
    setMensaje('');

    try {
      const descripcion = `Reserva de ${cantidad} ${producto.nombre}`;
      const total = producto.precio * cantidad;

      // 🔹 Registrar intento (punto de recuperación antes del envío)
      registrarEnBitacora("Intento de reserva", {
        productoId,
        cantidad,
        total,
      }, "en_proceso");

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
        }, "exitoso");

        setMensaje('✅ Reserva realizada con éxito. Ve a "Mis Reservas" para confirmar.');

        // Actualizar stock localmente
        setProductos(prev => prev.map(p =>
          p.id === productoId ? { ...p, stock: p.stock - cantidad } : p
        ));

        setCantidades(prev => ({ ...prev, [productoId]: 0 }));

        await cargarReservas();

        setTimeout(() => setMensaje(''), 5000);
      } else {
        const errorMessage = data.error ||
          data.message ||
          data.details ||
          'Error al realizar la reserva';
        throw new Error(errorMessage);
      }
    } catch (error) {
      registrarEnBitacora("Error en reserva", { error: error.message }, "fallido");
      console.error('Error al reservar:', error);
      setMensaje(`❌ ${error.message}`);
    } finally {
      setReservando(prev => ({ ...prev, [productoId]: false }));
    }
  };

  const manejarReserva = async (ventaId, accion) => {
    try {
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ venta_id: ventaId, accion }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(data.message);

        const productosResponse = await fetch('/api/catalogo');
        const productosData = await productosResponse.json();
        setProductos(productosData);

        await cargarReservas();

        setTimeout(() => setMensaje(''), 3000);
      } else {
        const errorMessage = data.error ||
          data.message ||
          data.details ||
          'Error al procesar la reserva';
        throw new Error(errorMessage);
      }
    } catch (error) {
      setMensaje(`❌ ${error.message}`);
    }
  };

  const toggleReservas = async () => {
    if (!mostrarReservas) {
      await cargarReservas();
    }
    setMostrarReservas(!mostrarReservas);
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

      {mensaje && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
          mensaje.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {mensaje}
        </div>
      )}

      {cargandoUsuario && (
        <div className="text-center text-gray-600 mb-4">
          Verificando usuario...
        </div>
      )}

      {!usuarioId && !cargandoUsuario && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6">
          ⚠️ Debes iniciar sesión para reservar productos
        </div>
      )}

      {usuarioId && (
        <div className="mb-6 text-center">
          <button
            onClick={toggleReservas}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {mostrarReservas ? 'Ocultar Mis Reservas' : 'Ver Mis Reservas'}
          </button>
        </div>
      )}

      {mostrarReservas && usuarioId && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Mis Reservas</h2>

          {!Array.isArray(reservas) || reservas.length === 0 ? (
            <p className="text-gray-600">No tienes reservas pendientes.</p>
          ) : (
            <div className="space-y-4">
              {reservas.map((reserva) => (
                <div key={reserva.detalle_id || reserva.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={reserva.imagen_url || 'https://placehold.co/60x60?text=Sin+Imagen'}
                        alt={reserva.producto_nombre}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold">{reserva.producto_nombre}</h3>
                        <p>Cantidad: {reserva.cantidad}</p>
                        <p>Precio unitario: Q{reserva.precio_unitario}</p>
                        <p>Total: Q{reserva.total}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          reserva.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {reserva.estado?.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {reserva.estado === 'pendiente' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => manejarReserva(reserva.venta_id, 'confirmar')}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          ✅ Confirmar
                        </button>
                        <button
                          onClick={() => manejarReserva(reserva.venta_id, 'cancelar')}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          ❌ Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
            <p className={`text-sm ${
              producto.stock > 10 ? 'text-green-600' :
              producto.stock > 0 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              Stock: {producto.stock}
            </p>

            {producto.stock > 0 ? (
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
                    disabled={reservando[producto.id] || !usuarioId}
                  />
                  <button
                    onClick={() => reservarProducto(producto.id)}
                    disabled={
                      !cantidades[producto.id] ||
                      cantidades[producto.id] <= 0 ||
                      reservando[producto.id] ||
                      !usuarioId
                    }
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {reservando[producto.id] ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                      </span>
                    ) : (
                      'Reservar'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-center">
                <span className="text-red-600 font-medium">Agotado</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {productos.length === 0 && !mensaje && (
        <div className="text-center text-gray-600 mt-10">
          No hay productos disponibles en este momento.
        </div>
      )}

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
