"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function CitasFormPage() {
  const [citas, setCitas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [detalleCita, setDetalleCita] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [citaActual, setCitaActual] = useState(null);
  const [citasConServicios, setCitasConServicios] = useState({});
  
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
        setDetalleCita(cita);
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
        setDetalleCita(null);
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
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
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
      setDetalleCita(null);
      setServiciosSeleccionados([]);
      setCitaActual(null);
      fetchCitas();
    } catch (error) {
      console.error("Error al eliminar cita:", error);
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

  const handleServicioChange = (e) => {
    const servicioId = parseInt(e.target.value);
    const isChecked = e.target.checked;
    
    if (isChecked) {
      setServiciosSeleccionados(prev => [...prev, servicioId]);
    } else {
      setServiciosSeleccionados(prev => prev.filter(id => id !== servicioId));
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

  useEffect(() => {
    fetchCitas();
    fetchServicios();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-purple-800">Gestión de Citas de Servicio</h1>

            <Link href="/">
              <button className="fixed top-4 left-4 inline-flex items-center px-3 py-2 border border-indigo-600 shadow-sm text-sm font-medium rounded-md text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            ← Inicio
        </button>
    </Link>

      <div className="bg-[#F3E5F5] border-[3px] border-yellow-500 rounded-lg p-4 shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">📓 Libreta de Citas</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-purple-100 text-purple-800">
              <th className="border p-2">ID</th>
              <th className="border p-2">Fecha</th>
              <th className="border p-2">Hora</th>
              <th className="border p-2">Estado</th>
              <th className="border p-2">Costo</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Teléfono</th>
              <th className="border p-2">Servicios</th>
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
                <td className="border p-2">{obtenerNombresServicios(cita.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 mb-4">
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
            setDetalleCita(null);
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
              <h3 className="font-bold text-purple-800 mb-2">Servicios para esta cita</h3>
              <div className="grid grid-cols-2 gap-2">
                {servicios.map((servicio) => (
                  <div key={servicio.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`servicio-${servicio.id}`}
                      value={servicio.id}
                      checked={serviciosSeleccionados.includes(servicio.id)}
                      onChange={handleServicioChange}
                      className="text-purple-600"
                    />
                    <label htmlFor={`servicio-${servicio.id}`} className="text-purple-800">
                      {servicio.nombre_servicio} - Q{servicio.precio}
                    </label>
                  </div>
                ))}
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

      {detalleCita && (
        <div className="mt-6 p-4 border rounded bg-purple-50 text-purple-800">
          <h2 className="font-bold mb-2">Detalle de la cita</h2>
          <pre>{JSON.stringify(detalleCita, null, 2)}</pre>
          
          {citasConServicios[detalleCita.id] && (
            <div className="mt-2">
              <h3 className="font-bold">Servicios asociados:</h3>
              <ul className="list-disc pl-5">
                {citasConServicios[detalleCita.id].map((servicioCita) => {
                  const servicio = servicios.find(s => s.id === servicioCita.id_servicio);
                  return (
                    <li key={servicioCita.id_servicio}>
                      {servicio ? `${servicio.nombre_servicio} - Q${servicio.precio}` : `Servicio #${servicioCita.id_servicio}`}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}