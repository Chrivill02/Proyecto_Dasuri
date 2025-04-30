"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ServiciosPage() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre_servicio: "",
    descripcion: "",
    precio: "",
    duracion: "",
    categoria: "General"
  });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchServicios();
  }, []);

  async function fetchServicios() {
    try {
      const response = await fetch("/api/servicios");
      if (!response.ok) throw new Error("Error al cargar servicios");
      const data = await response.json();
      setServicios(data);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (servicio) => {
    setFormData({
      nombre_servicio: servicio.nombre_servicio,
      descripcion: servicio.descripcion || "",
      precio: servicio.precio,
      duracion: servicio.duracion || "",
      categoria: servicio.categoria || "General"
    });
    setEditingId(servicio.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const url = editingId ? `/api/servicios/${editingId}` : "/api/servicios";
      const method = editingId ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al ${editingId ? 'actualizar' : 'crear'} el servicio`);
      }
      await fetchServicios();
      cancelForm();
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este servicio? Esto podría afectar a las citas existentes.")) {
      try {
        const response = await fetch(`/api/servicios/${id}`, { method: "DELETE" });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al eliminar el servicio");
        }
        await fetchServicios();
      } catch (error) {
        console.error("Error:", error);
        alert(error.message);
      }
    }
  };

  const cancelForm = () => {
    setFormData({
      nombre_servicio: "",
      descripcion: "",
      precio: "",
      duracion: "",
      categoria: "General"
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-300 drop-shadow-sm">
            Gestión de Servicios
          </h1>
          <div className="h-1 w-32 bg-amber-400 mx-auto mt-2"></div>
        </div>

        <div className="flex justify-center mb-6 gap-4">
          <Link href="/citas" className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md">
            Citas
          </Link>
          <Link href="/servicios" className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-md">
            Gestionar Servicios
          </Link>
          <Link href="/servicios/nuevo" className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md">
            Nuevo Servicio
          </Link>
          <Link href="/servicios/categorias" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md">
            Categorías
          </Link>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-xl border-2 border-amber-200 p-6 relative mb-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="nombre_servicio" value={formData.nombre_servicio} onChange={handleChange} placeholder="Nombre del servicio" required className="border p-2 rounded-md" />
                <input type="text" name="precio" value={formData.precio} onChange={handleChange} placeholder="Precio" required className="border p-2 rounded-md" />
                <input type="text" name="duracion" value={formData.duracion} onChange={handleChange} placeholder="Duración" className="border p-2 rounded-md" />
                <select name="categoria" value={formData.categoria} onChange={handleChange} className="border p-2 rounded-md">
                  <option value="General">General</option>
                  <option value="Uñas">Uñas</option>
                  <option value="Pelo">Pelo</option>
                  <option value="Maquillaje">Maquillaje</option>
                </select>
              </div>
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción" className="w-full mt-4 border p-2 rounded-md" />
              {error && <p className="text-red-600 mt-2">{error}</p>}
              <div className="flex justify-end mt-4 gap-4">
                <button type="button" onClick={cancelForm} className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded-md">
                  Cancelar
                </button>
                <button type="submit" disabled={submitting} className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-md">
                  {editingId ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de servicios */}
        <div className="grid gap-4">
          {loading ? (
            <p className="text-center text-gray-600">Cargando servicios...</p>
          ) : servicios.length === 0 ? (
            <p className="text-center text-gray-500">No hay servicios registrados.</p>
          ) : (
            servicios.map((servicio) => (
              <div key={servicio.id} className="border rounded-lg p-4 bg-white shadow-sm flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{servicio.nombre_servicio}</h2>
                  <p className="text-gray-600">{servicio.descripcion}</p>
                  <p className="text-gray-700 font-medium">${servicio.precio}</p>
                  <p className="text-sm text-gray-500">Duración: {servicio.duracion}</p>
                  <p className="text-sm text-gray-500">Categoría: {servicio.categoria}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(servicio)} className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-1 px-3 rounded-md">Editar</button>
                  <button onClick={() => handleDelete(servicio.id)} className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded-md">Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
