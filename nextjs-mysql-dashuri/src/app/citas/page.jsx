"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AgendaPage() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fecha_cita: "",
    hora_cita: "",
    estado: "Pendiente",
    costo: "",
    nombre_cliente: "",
    telefono_cliente: "",
    servicios: []
  });
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchCitas();
    fetchServicios();
  }, []);

  async function fetchCitas() {
    try {
      const response = await fetch("/api/citas");
      const data = await response.json();
      setCitas(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar citas:", error);
      setLoading(false);
    }
  }

  async function fetchServicios() {
    try {
      const response = await fetch("/api/servicios");
      const data = await response.json();
      setServiciosDisponibles(data);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleServicioChange = (e) => {
    const servicioId = parseInt(e.target.value);
    if (e.target.checked) {
      // Agregar servicio
      setServiciosSeleccionados([...serviciosSeleccionados, servicioId]);
    } else {
      // Quitar servicio
      setServiciosSeleccionados(serviciosSeleccionados.filter(id => id !== servicioId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/citas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          servicios: serviciosSeleccionados
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la cita");
      }

      // Actualizar la lista de citas y resetear el formulario
      await fetchCitas();
      setFormData({
        fecha_cita: "",
        hora_cita: "",
        estado: "Pendiente",
        costo: "",
        nombre_cliente: "",
        telefono_cliente: "",
        servicios: []
      });
      setServiciosSeleccionados([]);
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta cita?")) {
      try {
        const response = await fetch(`/api/citas?id=${id}`, {
          method: "DELETE"
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al eliminar la cita");
        }

        // Actualizar la lista de citas
        await fetchCitas();
      } catch (error) {
        console.error("Error:", error);
        alert(error.message);
      }
    }
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatearHora = (horaStr) => {
    // Asumiendo formato HH:MM:SS de la base de datos, mostramos solo HH:MM
    return horaStr.substring(0, 5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Cabecera con título dorado */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-300 drop-shadow-sm">
            Mi Agenda de Citas
          </h1>
          <div className="h-1 w-32 bg-purple-400 mx-auto mt-2"></div>
        </div>

        {/* Menú de navegación */}
        <div className="flex justify-center mb-6 gap-4">
          <Link href="/citas" className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md">
            Citas
          </Link>
          <Link href="/servicios" className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-md">
            Gestionar Servicios
          </Link>
        </div>

        {/* Contenedor principal estilo agenda */}
        <div className="bg-white rounded-lg shadow-xl border-2 border-purple-200 p-6 relative mb-8">
          {/* Adornos morados */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-purple-500 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-purple-500 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-purple-500 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-purple-500 rounded-br-lg"></div>

          {/* Líneas de agenda */}
          <div className="border-l-4 border-purple-300 pl-6 py-4 relative">
            {/* Líneas horizontales decorativas */}
            {[...Array(8)].map((_, index) => (
              <div 
                key={index}
                className="absolute w-full h-px bg-purple-100 left-0"
                style={{ top: `${(index + 1) * 12}%` }}
              ></div>
            ))}

            {/* Lista de citas */}
            <div className="mb-8">
              <h2 className="text-2xl text-amber-600 font-semibold mb-4 border-b border-amber-200 pb-2">
                Mis Citas
              </h2>

              {loading ? (
                <p className="text-gray-500 italic">Cargando citas...</p>
              ) : citas.length === 0 ? (
                <p className="text-gray-500 italic">No hay citas programadas</p>
              ) : (
                <ul className="space-y-4">
                  {citas.map((cita) => (
                    <li 
                      key={cita.id} 
                      className="p-4 rounded-md bg-purple-50 border-l-4 border-amber-400 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-purple-800">
                            Cliente: <span className="text-gray-800">{cita.nombre_cliente}</span>
                          </p>
                          <p className="font-medium text-purple-800">
                            Teléfono: <span className="text-gray-800">{cita.telefono_cliente || "N/A"}</span>
                          </p>
                          <p className="font-medium text-purple-800">
                            Fecha: <span className="text-gray-800">{formatearFecha(cita.fecha_cita)}</span>
                          </p>
                          <p className="font-medium text-purple-800">
                            Hora: <span className="text-gray-800">{formatearHora(cita.hora_cita)}</span>
                          </p>
                          <p className="font-medium text-purple-800">
                            Estado: <span className="text-gray-800">{cita.estado}</span>
                          </p>
                          
                          {/* Mostrar servicios */}
                          {cita.servicios && cita.servicios.length > 0 && (
                            <div className="mt-2">
                              <p className="font-medium text-purple-800">Servicios:</p>
                              <ul className="ml-6 list-disc">
                                {cita.servicios.map(servicio => (
                                  <li key={servicio.id} className="text-gray-800">
                                    {servicio.nombre_servicio} - ${servicio.precio}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-600 text-xl">Q{cita.costo}</p>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => router.push(`/citas/editar/${cita.id}`)}
                              className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(cita.id)}
                              className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Botón para mostrar/ocultar formulario */}
            <div className="flex justify-center mt-6">
              <button 
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105"
              >
                <span className="text-xl">{showForm ? '−' : '+'}</span>
                <span>{showForm ? 'Ocultar Formulario' : 'Agregar Nueva Cita'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Formulario para agregar cita */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-xl border-2 border-purple-200 p-6 relative">
            {/* Adornos morados */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-500 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-500 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-500 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-500 rounded-br-lg"></div>

            <h2 className="text-2xl text-amber-600 font-semibold mb-4 border-b border-amber-200 pb-2 text-center">
              Nueva Cita
            </h2>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre del cliente */}
                <div className="relative">
                  <label className="block text-sm font-medium text-purple-700 mb-1" htmlFor="nombre_cliente">
                    Nombre del Cliente
                  </label>
                  <div className="flex relative">
                    <span className="absolute left-3 top-3 text-purple-500">👤</span>
                    <input
                      type="text"
                      id="nombre_cliente"
                      name="nombre_cliente"
                      value={formData.nombre_cliente}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full border-2 border-purple-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                    />
                  </div>
                </div>

                {/* Teléfono del cliente */}
                <div className="relative">
                  <label className="block text-sm font-medium text-purple-700 mb-1" htmlFor="telefono_cliente">
                    Teléfono del Cliente
                  </label>
                  <div className="flex relative">
                    <span className="absolute left-3 top-3 text-purple-500">📞</span>
                    <input
                      type="tel"
                      id="telefono_cliente"
                      name="telefono_cliente"
                      value={formData.telefono_cliente}
                      onChange={handleChange}
                      className="pl-10 w-full border-2 border-purple-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                      placeholder="(Opcional)"
                    />
                  </div>
                </div>

                {/* Fecha */}
                <div className="relative">
                  <label className="block text-sm font-medium text-purple-700 mb-1" htmlFor="fecha_cita">
                    Fecha de la Cita
                  </label>
                  <div className="flex relative">
                    <span className="absolute left-3 top-3 text-purple-500">📅</span>
                    <input
                      type="date"
                      id="fecha_cita"
                      name="fecha_cita"
                      value={formData.fecha_cita}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full border-2 border-purple-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                    />
                  </div>
                </div>

                {/* Hora */}
                <div className="relative">
                  <label className="block text-sm font-medium text-purple-700 mb-1" htmlFor="hora_cita">
                    Hora de la Cita
                  </label>
                  <div className="flex relative">
                    <span className="absolute left-3 top-3 text-purple-500">🕒</span>
                    <input
                      type="time"
                      id="hora_cita"
                      name="hora_cita"
                      value={formData.hora_cita}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full border-2 border-purple-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                    />
                  </div>
                </div>

                {/* Estado */}
                <div className="relative">
                  <label className="block text-sm font-medium text-purple-700 mb-1" htmlFor="estado">
                    Estado
                  </label>
                  <div className="flex relative">
                    <span className="absolute left-3 top-3 text-purple-500">✓</span>
                    <select
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full border-2 border-purple-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Confirmada">Confirmada</option>
                      <option value="Cancelada">Cancelada</option>
                      <option value="Completada">Completada</option>
                    </select>
                  </div>
                </div>

                {/* Costo */}
                <div className="relative">
                  <label className="block text-sm font-medium text-purple-700 mb-1" htmlFor="costo">
                    Costo Total
                  </label>
                  <div className="flex relative">
                    <span className="absolute left-3 top-3 text-purple-500">Q</span>
                    <input
                      type="number"
                      id="costo"
                      name="costo"
                      value={formData.costo}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                      step="0.01"
                      min="0"
                      className="pl-10 w-full border-2 border-purple-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Servicios */}
              <div className="relative">
                <label className="block text-sm font-medium text-purple-700 mb-1">
                  Servicios
                </label>
                <div className="bg-purple-50 border-2 border-purple-200 rounded-md p-3">
                  {serviciosDisponibles.length === 0 ? (
                    <p className="text-gray-500 italic">Cargando servicios...</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {serviciosDisponibles.map(servicio => (
                        <div key={servicio.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`servicio-${servicio.id}`}
                            value={servicio.id}
                            onChange={handleServicioChange}
                            checked={serviciosSeleccionados.includes(servicio.id)}
                            className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500"
                          />
                          <label htmlFor={`servicio-${servicio.id}`} className="text-gray-700">
                            {servicio.nombre_servicio} - <span className="font-medium text-amber-600">Q{servicio.precio}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-between pt-4 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-md shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                >
                  {submitting ? "Guardando..." : "Guardar Cita"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}