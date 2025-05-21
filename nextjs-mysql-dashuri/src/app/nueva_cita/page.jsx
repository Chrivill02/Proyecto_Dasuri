"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function CitasFormPage() {
  const [citas, setCitas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [citaActual, setCitaActual] = useState(null);
  const [citasConServicios, setCitasConServicios] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const [citaParaServicios, setCitaParaServicios] = useState(null);
  const [serviciosParaModal, setServiciosParaModal] = useState([]);
  
  const [formulario, setFormulario] = useState({
    id: "",
    fecha_cita: "",
    hora_cita: "",
    estado: "",
    costo: "",
    nombre_cliente: "",
    telefono_cliente: ""
  });

  const form = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormulario({
      ...formulario,
      [name]: value
    });
  
    if (name === "id" && value) {
      const cita = citas.find((c) => c.id.toString() === value.toString());
      if (cita) {
        setCitaActual(cita.id);
        // Autocompletar los campos del formulario
        setFormulario({
          id: cita.id.toString(),
          fecha_cita: cita.fecha_cita || "",
          hora_cita: cita.hora_cita || "",
          estado: cita.estado || "",
          costo: cita.costo ? cita.costo.toString() : "",
          nombre_cliente: cita.nombre_cliente || "",
          telefono_cliente: cita.telefono_cliente || ""
        });
        
        // Cargar los servicios de esta cita
        fetchServiciosPorCita(cita.id);
      } else {
        setCitaActual(null);
        setServiciosSeleccionados([]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (formulario.id) {
        res = await axios.put("/api/nueva_cita", formulario);
      } else {
        res = await axios.post("/api/nueva_cita", formulario);
        // Si es una nueva cita, guardamos el ID retornado para asociar servicios
        if (res.data && res.data.id) {
          setCitaActual(res.data.id);
        }
      }

      // Si hay servicios seleccionados y tenemos un ID de cita, los asociamos
      if (serviciosSeleccionados.length > 0 && (citaActual || (res.data && res.data.id))) {
        const idCita = citaActual || res.data.id;
        await asociarServiciosACita(idCita, serviciosSeleccionados);
      }

      form.current.reset();
      setFormulario({
        id: "",
        fecha_cita: "",
        hora_cita: "",
        estado: "",
        costo: "",
        nombre_cliente: "",
        telefono_cliente: ""
      });
      setServiciosSeleccionados([]);
      setCitaActual(null);
      fetchCitas();
      alert("Cita guardada con éxito");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Error al guardar la cita");
    }
  };

  const handleDelete = async () => {
    if (!formulario.id) return;
    try {
      const res = await axios.delete("/api/nueva_cita", {
        data: { id: formulario.id }
      });
      form.current.reset();
      setFormulario({
        id: "",
        fecha_cita: "",
        hora_cita: "",
        estado: "",
        costo: "",
        nombre_cliente: "",
        telefono_cliente: ""
      });
      setServiciosSeleccionados([]);
      setCitaActual(null);
      fetchCitas();
      alert("Cita eliminada con éxito");
    } catch (error) {
      console.error("Error al eliminar cita:", error);
      alert("Error al eliminar la cita");
    }
  };

  const fetchCitas = async () => {
    try {
      const res = await fetch("/api/nueva_cita");
      const data = await res.json();
      setCitas(data);
      
      // Obtener servicios para cada cita
      data.forEach(cita => {
        fetchServiciosPorCita(cita.id);
      });
    } catch (error) {
      console.error("Error al cargar citas:", error);
    }
  };

  const fetchServicios = async () => {
    try {
      const res = await fetch("/api/servicios");
      const data = await res.json();
      setServicios(data);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    }
  };

  const fetchServiciosPorCita = async (idCita) => {
    try {
      // Suponiendo que hay un endpoint para obtener los servicios de una cita específica
      const res = await fetch(`/api/cita_servicios_detalles?cita_id=${idCita}`);
      const data = await res.json();
      
      if (data && Array.isArray(data)) {
        // Actualizar el estado de servicios por cita
        setCitasConServicios(prev => ({
          ...prev,
          [idCita]: data
        }));
        
        // Si es la cita actual en edición, actualizar los servicios seleccionados
        if (citaActual === idCita) {
          setServiciosSeleccionados(data.map(servicio => servicio.id_servicio));
        }
      }
    } catch (error) {
      console.error(`Error al cargar servicios para la cita ${idCita}:`, error);
    }
  };

  const asociarServiciosACita = async (idCita, idServicios) => {
    try {
      await axios.post("/api/cita_servicios_detalles", {
        id_cita: idCita,
        id_servicios: Array.isArray(idServicios) ? idServicios : [idServicios]
      });      
      // Actualizar los servicios de la cita
      fetchServiciosPorCita(idCita);
    } catch (error) {
      console.error("Error al asociar servicios a la cita:", error);
    }
  };

  const handleServicioClick = (servicioId) => {
    // Si ya está seleccionado, lo quitamos; si no, lo añadimos
    if (serviciosSeleccionados.includes(servicioId)) {
      setServiciosSeleccionados(prev => prev.filter(id => id !== servicioId));
    } else {
      setServiciosSeleccionados(prev => [...prev, servicioId]);
    }
  };

  const handleServicioModalClick = (servicioId) => {
    // Si ya está seleccionado, lo quitamos; si no, lo añadimos
    if (serviciosParaModal.includes(servicioId)) {
      setServiciosParaModal(prev => prev.filter(id => id !== servicioId));
    } else {
      setServiciosParaModal(prev => [...prev, servicioId]);
    }
  };

  const abrirModalServicios = (idCita) => {
    setCitaParaServicios(idCita);
    
    // Cargar los servicios ya asociados a esta cita
    const serviciosDeCita = citasConServicios[idCita] || [];
    const idsServicios = serviciosDeCita.map(s => s.id_servicio);
    setServiciosParaModal(idsServicios);
    
    setMostrarModal(true);
  };

  const guardarServiciosModal = async () => {
    if (!citaParaServicios) return;
    
    try {
      await asociarServiciosACita(citaParaServicios, serviciosParaModal);
      setMostrarModal(false);
      setCitaParaServicios(null);
      fetchCitas(); // Actualizar los datos de las citas
      alert("Servicios actualizados correctamente");
    } catch (error) {
      console.error("Error al guardar servicios:", error);
      alert("Error al actualizar los servicios");
    }
  };

  const obtenerNombresServicios = (idCita) => {
    if (!citasConServicios[idCita] || !servicios.length) return "Sin servicios";
    
    const serviciosDeCita = citasConServicios[idCita];
    return serviciosDeCita.map(servicioCita => {
      const servicio = servicios.find(s => s.id === servicioCita.id_servicio);
      return servicio ? servicio.nombre_servicio : `Servicio #${servicioCita.id_servicio}`;
    }).join(", ");
  };

  const calcularTotalServicios = (idCita) => {
    if (!citasConServicios[idCita] || !servicios.length) return 0;
    
    const serviciosDeCita = citasConServicios[idCita];
    return serviciosDeCita.reduce((total, servicioCita) => {
      const servicio = servicios.find(s => s.id === servicioCita.id_servicio);
      return total + (servicio ? parseFloat(servicio.precio) : 0);
    }, 0).toFixed(2);
  };

  useEffect(() => {
    fetchCitas();
    fetchServicios();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-purple-800">Gestión de Citas de Servicio</h1>

      <div className="flex flex-row gap-6">
        {/* Sección de la tabla de citas (izquierda) */}
        <div className="flex-grow">
          <div className="bg-[#F3E5F5] border-[3px] border-yellow-500 rounded-lg p-4 shadow-lg mb-6">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">📓 Libreta de Citas</h2>
            {/* Contenedor con altura fija y scroll */}
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full table-auto border-collapse">
                <thead className="sticky top-0 bg-purple-100">
                  <tr className="bg-purple-100 text-purple-800">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Fecha</th>
                    <th className="border p-2">Hora</th>
                    <th className="border p-2">Estado</th>
                    <th className="border p-2">Costo</th>
                    <th className="border p-2">Nombre</th>
                    <th className="border p-2">Teléfono</th>
                    <th className="border p-2">Servicios</th>
                    <th className="border p-2">Total</th>
                    <th className="border p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {citas.map((cita) => (
                    <tr key={cita.id} className="text-purple-700 hover:bg-purple-50">
                      <td className="border p-2">{cita.id}</td>
                      <td className="border p-2">{cita.fecha_cita}</td>
                      <td className="border p-2">{cita.hora_cita}</td>
                      <td className="border p-2">{cita.estado}</td>
                      <td className="border p-2">Q{cita.costo}</td>
                      <td className="border p-2">{cita.nombre_cliente}</td>
                      <td className="border p-2">{cita.telefono_cliente}</td>
                      <td className="border p-2">
                        <div className="max-w-xs overflow-hidden text-sm">
                          {obtenerNombresServicios(cita.id)}
                        </div>
                      </td>
                      <td className="border p-2 text-green-600 font-bold">
                        Q{calcularTotalServicios(cita.id)}
                      </td>
                      <td className="border p-2">
                        <button 
                          onClick={() => abrirModalServicios(cita.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Agregar Servicios
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Sección de servicios (derecha) */}
        <div className="w-64">
          <div className="bg-[#E1BEE7] p-4 rounded-lg border border-purple-300 shadow-md">
            <h3 className="font-bold text-purple-800 mb-3">Servicios Disponibles</h3>
            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
              {servicios.map((servicio) => (
                <button
                  key={servicio.id}
                  onClick={() => handleServicioClick(servicio.id)}
                  className={`p-2 rounded text-left ${
                    serviciosSeleccionados.includes(servicio.id)
                      ? "bg-purple-600 text-white"
                      : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                  }`}
                >
                  {servicio.nombre_servicio}
                  <div className="text-xs mt-1">
                    {serviciosSeleccionados.includes(servicio.id) ? "✓ Seleccionado" : `Q${servicio.precio}`}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-4 mt-4">
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          {mostrarFormulario ? "Ocultar Formulario" : "➕ Nueva Cita"}
        </button>
        
        <button
          onClick={() => {
            setFormulario({
              id: "",
              fecha_cita: "",
              hora_cita: "",
              estado: "",
              costo: "",
              nombre_cliente: "",
              telefono_cliente: ""
            });
            setServiciosSeleccionados([]);
            setCitaActual(null);
            setMostrarFormulario(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          🔄 Limpiar Formulario
        </button>
      </div>

      {mostrarFormulario && (
        <div className="space-y-6">
          <form ref={form} onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="id"
              placeholder="ID (para editar/eliminar)"
              onChange={handleChange}
              className="w-full p-2 bg-[#EDE7F6] border rounded text-purple-800"
            />
            <input
              type="date"
              name="fecha_cita"
              placeholder="Fecha"
              onChange={handleChange}
              value={formulario.fecha_cita}
              className="w-full p-2 bg-[#EDE7F6] border rounded text-purple-800"
            />
            <input
              type="time"
              name="hora_cita"
              placeholder="Hora"
              onChange={handleChange}
              value={formulario.hora_cita}
              className="w-full p-2 bg-[#EDE7F6] border rounded text-purple-800"
            />
            <input
              type="text"
              name="estado"
              placeholder="Estado"
              onChange={handleChange}
              value={formulario.estado}
              className="w-full p-2 bg-[#EDE7F6] border rounded text-purple-800"
            />
            <input
              type="number"
              name="costo"
              placeholder="Costo"
              onChange={handleChange}
              value={formulario.costo}
              className="w-full p-2 bg-[#EDE7F6] border rounded text-purple-800"
            />
            <input
              type="text"
              name="nombre_cliente"
              placeholder="Nombre del Cliente"
              onChange={handleChange}
              value={formulario.nombre_cliente}
              className="w-full p-2 bg-[#EDE7F6] border rounded text-purple-800"
            />
            <input
              type="text"
              name="telefono_cliente"
              placeholder="Teléfono del Cliente"
              onChange={handleChange}
              value={formulario.telefono_cliente}
              className="w-full p-2 bg-[#EDE7F6] border rounded text-purple-800"
            />

            <div className="bg-[#E1BEE7] p-4 rounded-lg border border-purple-300">
              <h3 className="font-bold text-purple-800 mb-2">Servicios seleccionados para esta cita:</h3>
              <div className="flex flex-wrap gap-2">
                {serviciosSeleccionados.length > 0 ? (
                  serviciosSeleccionados.map((servicioId) => {
                    const servicio = servicios.find(s => s.id === servicioId);
                    return servicio ? (
                      <span key={servicioId} className="bg-purple-600 text-white px-2 py-1 rounded text-sm">
                        {servicio.nombre_servicio} (Q{servicio.precio})
                      </span>
                    ) : null;
                  })
                ) : (
                  <span className="text-purple-800">No hay servicios seleccionados</span>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="bg-purple-700 text-white p-2 rounded">
                Guardar Cita
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white p-2 rounded"
              >
                Eliminar Cita
              </button>
              
              {formulario.id && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!formulario.id || serviciosSeleccionados.length === 0) return;
                    try {
                      await asociarServiciosACita(formulario.id, serviciosSeleccionados);
                      alert("Servicios asociados correctamente a la cita");
                      fetchCitas();
                    } catch (error) {
                      console.error("Error al asociar servicios:", error);
                      alert("Error al asociar servicios");
                    }
                  }}
                  className="bg-blue-600 text-white p-2 rounded"
                >
                  Actualizar Servicios
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Modal para seleccionar servicios */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-lg">
            <h2 className="text-xl font-bold text-purple-800 mb-4">Seleccionar Servicios</h2>
            
            <div className="max-h-96 overflow-y-auto">
              <div className="grid gap-2">
                {servicios.map((servicio) => (
                  <div 
                    key={servicio.id}
                    className={`p-3 rounded border flex justify-between items-center cursor-pointer ${
                      serviciosParaModal.includes(servicio.id)
                        ? "bg-purple-100 border-purple-500"
                        : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                    }`}
                    onClick={() => handleServicioModalClick(servicio.id)}
                  >
                    <div>
                      <div className="font-medium">{servicio.nombre_servicio}</div>
                      <div className="text-sm text-green-600">Q{servicio.precio}</div>
                    </div>
                    <div>
                      {serviciosParaModal.includes(servicio.id) && (
                        <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <div className="text-sm">
                <span className="font-bold">Total seleccionado: </span>
                <span className="text-green-600 font-bold">
                  Q{serviciosParaModal.reduce((total, id) => {
                    const servicio = servicios.find(s => s.id === id);
                    return total + (servicio ? parseFloat(servicio.precio) : 0);
                  }, 0).toFixed(2)}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-bold">Cantidad: </span>
                <span className="text-purple-600 font-bold">{serviciosParaModal.length} servicios</span>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setMostrarModal(false);
                  setCitaParaServicios(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={guardarServiciosModal}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Guardar Servicios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}