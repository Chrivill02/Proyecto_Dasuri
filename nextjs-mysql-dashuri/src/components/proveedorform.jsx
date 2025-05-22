"use client";
import axios from "axios";
import { useState, useRef } from "react";

function ProveedorForm({ onUpdate }) {
  const [formData, setFormData] = useState({
    _id: "",
    nombre: "",
    telefono: "",
    correo: "",
  });

  const [idEliminar, setIdEliminar] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const formRef = useRef(null);

  // Crear proveedor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Siempre crea nuevo proveedor (POST)
      const res = await axios.post("/api/ComprasProveedor", formData);
      if (res.status === 201) {
        setMessage({ text: "✅ Proveedor creado", type: "success" });
        formRef.current?.reset();
        setFormData({ _id: "", nombre: "", telefono: "", correo: "" });
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      setMessage({
        text: error.response?.data?.message || "❌ Error al guardar",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar proveedor
  const handleDelete = async () => {
    if (!idEliminar) {
      setMessage({ text: "❌ Ingresa un ID para eliminar", type: "error" });
      return;
    }

    if (!confirm(`¿Eliminar proveedor con ID ${idEliminar}?`)) return;

    setLoading(true);
    try {
      const res = await axios.delete(`/api/ComprasProveedor/${idEliminar}`);
      if (res.status === 200) {
        setMessage({ text: "🗑️ Proveedor eliminado", type: "success" });
        setIdEliminar("");
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      setMessage({
        text: error.response?.data?.message || "❌ Error al eliminar",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">➕ Agregar Proveedor</h2>

      {message.text && (
        <div
          className={`p-3 mb-4 rounded ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            placeholder="Nombre"
            className="w-full p-2 border rounded"
            disabled={loading}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <input
            type="text"
            value={formData.telefono}
            onChange={(e) =>
              setFormData({ ...formData, telefono: e.target.value })
            }
            placeholder="telefono"
            className="w-full p-2 border rounded"
            disabled={loading}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Correo</label>
          <input
            type="email"
            value={formData.correo}
            onChange={(e) =>
              setFormData({ ...formData, correo: e.target.value })
            }
            placeholder="correo"
            className="w-full p-2 border rounded"
            disabled={loading}
            required
          />
        </div>

        {/* Sección para eliminar */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">🗑️ Eliminar Proveedor</label>
          <div className="flex">
            <input
              type="text"
              value={idEliminar}
              onChange={(e) => setIdEliminar(e.target.value)}
              placeholder="Ingrese el ID del proveedor a eliminar"
              className="flex-1 p-2 border rounded-l"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading || !idEliminar}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-r disabled:opacity-50"
            >
              Eliminar
            </button>
          </div>
        </div>

        {/* Botón Guardar centrado */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded disabled:opacity-50"
          >
            {loading ? "⏳ Procesando..." : "💾 Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProveedorForm;