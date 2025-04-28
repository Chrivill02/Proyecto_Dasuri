// app/page.jsx
"use client";
import { useState, useEffect } from "react";

export default function AgendaPage() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fecha_cita: "",
    hora_cita: "",
    estado: "Pendiente",
    costo: "",
    cliente_id: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCitas();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
        body: JSON.stringify(formData)
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
        cliente_id: ""
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
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
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-purple-800">
                            Fecha: <span className="text-gray-800">{new Date(cita.fecha_cita).toLocaleDateString()}</span>
                          </p>
                          <p className="font-medium text-purple-800">
                            Hora: <span className="text-gray-800">{cita.hora_cita}</span>
                          </p>
                          <p className="font-medium text-purple-800">
                            Estado: <span className="text-gray-800">{cita.estado}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-600">${cita.costo}</p>
                          <p className="text-sm text-gray-500">Cliente ID: {cita.cliente_id}</p>
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

      <div className="space-y-4">
        {/* Nombre */}
        <div className="relative">
          <label className="block text-sm font-medium text-purple-700 mb-1" htmlFor="nombre">
            Nombre
          </label>
          <div className="flex relative">
            <span className="absolute left-3 top-3 text-purple-500">👤</span>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="pl-10 w-full border-2 border-purple-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
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
            Costo
          </label>
          <div className="flex relative">
            <span className="absolute left-3 top-3 text-purple-500">$</span>
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

        {/* Servicios */}
        <div className="relative">
          <label className="block text-sm font-medium text-purple-700 mb-1" htmlFor="servicios">
            Servicios
          </label>
          <div className="flex relative">
            <span className="absolute left-3 top-3 text-purple-500">💇</span>
            <select
              id="servicios"
              name="servicios"
              value={formData.servicios}
              onChange={handleChange}
              required
              className="pl-10 w-full border-2 border-purple-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
            >
              <option value="Pelo">Pelo</option>
              <option value="Uñas">Uñas</option>
              <option value="Maquillaje">Maquillaje</option>
            </select>
          </div>
        </div>

        {/* Comentarios */}
        <div className="relative">
          <label className="block text-sm font-medium text-purple-700 mb-1" htmlFor="comentarios">
            Comentarios
          </label>
          <div className="flex relative">
            <span className="absolute left-3 top-3 text-purple-500">📝</span>
            <textarea
              id="comentarios"
              name="comentarios"
              value={formData.comentarios}
              onChange={handleChange}
              className="pl-10 w-full border-2 border-purple-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
            ></textarea>
          </div>
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