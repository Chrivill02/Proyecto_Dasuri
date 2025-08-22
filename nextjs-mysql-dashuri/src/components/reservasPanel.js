// components/ReservasPanel.js
'use client';
import { useState, useEffect } from 'react';

export default function ReservasPanel({ usuarioId }) {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (usuarioId) {
      cargarReservas();
    }
  }, [usuarioId]);

  const cargarReservas = async () => {
    try {
      const response = await fetch(`/api/reservas?usuario_id=${usuarioId}`);
      const data = await response.json();
      setReservas(data);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    } finally {
      setCargando(false);
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
        alert(data.message);
        cargarReservas(); // Recargar la lista
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (cargando) return <div className="text-center">Cargando reservas...</div>;

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Mis Reservas</h2>
      
      {reservas.length === 0 ? (
        <p className="text-gray-600">No tienes reservas pendientes.</p>
      ) : (
        <div className="space-y-4">
          {reservas.map((reserva) => (
            <div key={reserva.detalle_id} className="border rounded-lg p-4">
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
                    <p className={`inline-block px-2 py-1 rounded text-xs ${
                      reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      reserva.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {reserva.estado.toUpperCase()}
                    </p>
                  </div>
                </div>
                
                {reserva.estado === 'pendiente' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => manejarReserva(reserva.venta_id, 'confirmar')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      ✅ Confirmar
                    </button>
                    <button
                      onClick={() => manejarReserva(reserva.venta_id, 'cancelar')}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
  );
}