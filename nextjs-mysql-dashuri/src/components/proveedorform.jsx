"use client";
import axios from "axios";
import { useState, useRef } from "react";

function ProveedorForm({ onUpdate }) {
  // Estados del formulario
  const [formData, setFormData] = useState({
    _id: "",
    nombre: "",
    telefono: "",
    correo: "",
  });

  const [idEliminar, setIdEliminar] = useState("");
  const [mode, setMode] = useState("create"); // "create" o "edit"
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const formRef = useRef(null);

  // 🔄 Función para CARGAR un proveedor por ID (Botón "Cargar")
  const loadProveedor = async () => {
    if (!formData._id) {
      setMessage({ text: "Ingresa un ID válido", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`/api/ComprasProveedor/${formData._id}`);
      
      if (res.data) {
        setFormData({
          _id: res.data._id || formData._id,
          nombre: res.data.nombre || "",
          telefono: res.data.telefono || "",
          correo: res.data.correo || "",
        });
        setMessage({ text: "✅ Proveedor cargado", type: "success" });
      } else {
        setMessage({ text: "❌ No se encontró el proveedor", type: "error" });
      }
    } catch (error) {
      console.error("Error al cargar:", error);
      setMessage({
        text: "❌ Error al cargar el proveedor. Verifica el ID.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // 📤 Función para CREAR o ACTUALIZAR (Botón "Guardar/Actualizar")
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        // Crear nuevo proveedor (POST)
        const res = await axios.post("/api/ComprasProveedor", formData);
        if (res.status === 201) {
          setMessage({ text: "✅ Proveedor creado", type: "success" });
          formRef.current?.reset();
          setFormData({ _id: "", nombre: "", telefono: "", correo: "" });
          if (onUpdate) onUpdate(); // Actualizar lista de proveedores
        }
      } else {
        // Actualizar proveedor existente (PUT)
        if (!formData._id) {
          throw new Error("ID no válido");
        }

        const res = await axios.put(`/api/ComprasProveedor/${formData._id}`, {
          nombre: formData.nombre,
          telefono: formData.telefono,
          correo: formData.correo,
        });

        if (res.status === 200) {
          setMessage({ text: "✅ Proveedor actualizado", type: "success" });
          if (onUpdate) onUpdate(); // Actualizar lista de proveedores
        }
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      setMessage({
        text: error.response?.data?.message || "❌ Error al guardar cambios",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Función para ELIMINAR un proveedor
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

  // 🔄 Cambiar entre modo "Crear" y "Editar"
  const switchMode = () => {
    setMode(mode === "create" ? "edit" : "create");
    setFormData({ _id: "", nombre: "", telefono: "", correo: "" });
    setMessage({ text: "", type: "" });
    if (formRef.current) formRef.current.reset();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">
        {mode === "create" ? "➕ Agregar Proveedor" : "✏️ Editar Proveedor"}
      </h2>

      {/* Mensajes de éxito/error */}
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
        {/* Campo ID (solo en modo edición) */}
        {mode === "edit" && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              ID del Proveedor
            </label>
            <div className="flex">
              <input
                type="text"
                value={formData._id}
                onChange={(e) =>
                  setFormData({ ...formData, _id: e.target.value })
                }
                placeholder="Ej: 507f1f77bcf86cd799439011"
                className="flex-1 p-2 border rounded-l"
                disabled={loading}
              />
              <button
                type="button"
                onClick={loadProveedor}
                disabled={loading || !formData._id}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r disabled:opacity-50"
              >
                {loading ? "⏳ Cargando..." : "🔍 Cargar"}
              </button>
            </div>
          </div>
        )}

        {/* Campos del formulario */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            placeholder="Ej: Distribuidora López"
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
            placeholder="Ej: 5551234567"
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
            placeholder="Ej: contacto@proveedor.com"
            className="w-full p-2 border rounded"
            disabled={loading}
            required
          />
        </div>

        {/* Sección para eliminar */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            🗑️ Eliminar Proveedor
          </label>
          <div className="flex">
            <input
              type="text"
              value={idEliminar}
              onChange={(e) => setIdEliminar(e.target.value)}
              placeholder="Ingresa el ID a eliminar"
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

        {/* Botones principales */}
        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={switchMode}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded flex-1 disabled:opacity-50"
          >
            {mode === "create" ? "✏️ Modo Edición" : "➕ Modo Creación"}
          </button>

          <button
            type="submit"
            disabled={loading || (mode === "edit" && !formData._id)}
            className={`py-2 px-4 rounded text-white flex-1 ${
              mode === "create"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-yellow-500 hover:bg-yellow-600"
            } disabled:opacity-50`}
          >
            {loading
              ? "⏳ Procesando..."
              : mode === "create"
              ? "💾 Guardar"
              : "🔄 Actualizar"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProveedorForm;