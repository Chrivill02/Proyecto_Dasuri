"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function GestionServiciosPage({ params }) {
  const citaId = params.citaId;
  const router = useRouter();
  
  const [cita, setCita] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Cargar la información de la cita
  const fetchCita = async () => {
    try {
      const res = await fetch(`/api/nueva_cita?id=${citaId}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        setCita(data[0]);
      } else {
        setErrorMessage("No se encontró la cita especificada");
      }
    } catch (error) {
      console.error("Error al cargar la cita:", error);
      setErrorMessage("Error al cargar la información de la cita");
    }
  };

  // Cargar todos los servicios disponibles
  const fetchServicios = async () => {
    try {
      const res = await fetch("/api/servicios");
      const data = await res.json();
      setServicios(data);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
      setErrorMessage("Error al cargar los servicios disponibles");
    }
  };

  // Cargar los servicios asociados a esta cita
  const fetchServiciosCita = async () => {
    try {
      const res = await fetch(`/api/cita_servicios_detalles?cita_id=${citaId}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        // Extraer solo los IDs de servicios para marcarlos como seleccionados
        const ids = data.map(servicio => servicio.id_servicio || servicio.servicio_id);
        setServiciosSeleccionados(ids);
      } else {
        setServiciosSeleccionados([]);
      }
    } catch (error) {
      console.error("Error al cargar servicios de la cita:", error);
      setErrorMessage("Error al cargar los servicios asociados a la cita");
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en la selección de servicios
  const handleServicioChange = (e) => {
    const servicioId = parseInt(e.target.value);
    const isChecked = e.target.checked;
    
    if (isChecked) {
      setServiciosSeleccionados(prev => [...prev, servicioId]);
    } else {
      setServiciosSeleccionados(prev => prev.filter(id => id !== servicioId));
    }
  };

  // Guardar los servicios seleccionados
  const guardarServicios = async () => {
    try {
      setGuardando(true);
      setErrorMessage("");
      setSuccessMessage("");
      
      const res = await axios.post("/api/cita_servicios_detalles", {
        cita_id: citaId,
        id_servicios: serviciosSeleccionados
      });
      
      setSuccessMessage("¡Servicios asociados correctamente a la cita!");
      // Recargar los servicios de la cita para mostrar los cambios
      fetchServiciosCita();
    } catch (error) {
      console.error("Error al guardar servicios:", error);
      setErrorMessage("Error al guardar los servicios. Por favor, intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  useEffect(() => {
    if (citaId) {
      fetchCita();
      fetchServicios();
      fetchServiciosCita();
    }
  }, [citaId]);

  // Calcular el costo total de los servicios seleccionados
  const calcularCostoTotal = () => {
    return servicios
      .filter(servicio => serviciosSeleccionados.includes(servicio.id))
      .reduce((total, servicio) => total + parseFloat(servicio.precio || 0), 0);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto bg-white min-h-screen">
        <div className="text-center">
          <p className="text-purple-800 text-lg">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-purple-800">
        Gestión de Servicios para Cita
      </h1>
      
      <div className="mb-6">
        <Link href="/citas" className="bg-gray-600 text-white px-4 py-2 rounded">
          ← Volver a Citas
        </Link>
      </div>
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {cita && (
        <div className="bg-[#F3E5F5] border border-purple-300 rounded-lg p-4 shadow-md mb-6">
          <h2 className="text-xl font-semibold text-purple-800 mb-2">Información de la Cita</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>ID:</strong> {cita.id}</p>
              <p><strong>Fecha:</strong> {cita.fecha_cita}</p>
              <p><strong>Hora:</strong> {cita.hora_cita}</p>
              <p><strong>Estado:</strong> {cita.estado}</p>
            </div>
            <div>
              <p><strong>Cliente:</strong> {cita.nombre_cliente}</p>
              <p><strong>Teléfono:</strong> {cita.telefono_cliente}</p>
              <p><strong>Costo Base:</strong> Q{cita.costo}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-[#E1BEE7] border border-purple-300 rounded-lg p-4 shadow-md mb-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">Selecciona los servicios para esta cita</h2>
        <div className="grid grid-cols-2 gap-4">
          {servicios.map((servicio) => (
            <div key={servicio.id} className="bg-white p-3 rounded shadow-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`servicio-${servicio.id}`}
                  value={servicio.id}
                  checked={serviciosSeleccionados.includes(servicio.id)}
                  onChange={handleServicioChange}
                  className="mr-2 h-5 w-5 text-purple-600"
                />
                <label htmlFor={`servicio-${servicio.id}`} className="text-purple-800 flex-1">
                  <span className="font-medium">{servicio.nombre_servicio}</span>
                  <span className="block text-sm text-gray-600">{servicio.descripcion}</span>
                  <span className="block font-bold">Q{servicio.precio}</span>
                </label>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 bg-purple-100 p-4 rounded">
          <p className="text-lg font-bold text-purple-800">
            Total de servicios seleccionados: {serviciosSeleccionados.length}
          </p>
          <p className="text-lg font-bold text-purple-800">
            Costo total de servicios: Q{calcularCostoTotal().toFixed(2)}
          </p>
        </div>
        
        <div className="mt-6 flex justify-center">
          <button
            onClick={guardarServicios}
            disabled={guardando}
            className="bg-purple-700 text-white px-6 py-3 rounded-lg text-lg font-bold shadow-md hover:bg-purple-800 transition-colors"
          >
            {guardando ? "Guardando..." : "Guardar Servicios"}
          </button>
        </div>
      </div>
      
      {serviciosSeleccionados.length > 0 && (
        <div className="bg-purple-50 border border-purple-300 rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">Servicios seleccionados</h2>
          <ul className="list-disc pl-5">
            {serviciosSeleccionados.map(id => {
              const servicio = servicios.find(s => s.id === id);
              return servicio ? (
                <li key={id} className="mb-2">
                  <span className="font-medium">{servicio.nombre_servicio}</span>
                  <span className="ml-2 text-purple-600">Q{servicio.precio}</span>
                </li>
              ) : null;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}