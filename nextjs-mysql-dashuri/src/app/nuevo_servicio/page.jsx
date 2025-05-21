"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function NuevoServicioPage() {
  const [servicios, setServicios] = useState([]);
  const [detalleServicio, setDetalleServicio] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");
  const [formulario, setFormulario] = useState({
    id: "",
    nombre_servicio: "",
    precio: ""
  });

  const form = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === "id") {
      if (value) {
        const servicio = servicios.find((s) => s.id.toString() === value.toString());
        if (servicio) {
          setDetalleServicio(servicio);
          setFormulario({
            id: servicio.id.toString(),
            nombre_servicio: servicio.nombre_servicio || "",
            precio: servicio.precio ? servicio.precio.toString() : ""
          });
        } else {
          setDetalleServicio(null);
          setFormulario({
            id: "",
            nombre_servicio: "",
            precio: ""
          });
        }
      } else {
        setDetalleServicio(null);
        setFormulario((prev) => ({
          ...prev,
          nombre_servicio: "",
          precio: ""
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMensajeExito("");
    setCargando(true);

    try {
      if (!formulario.nombre_servicio.trim()) {
        throw new Error("El nombre del servicio es obligatorio");
      }

      if (!formulario.precio.trim() || isNaN(Number(formulario.precio))) {
        throw new Error("El precio debe ser un número válido");
      }

      let res;
      const datos = {
        ...formulario,
        precio: Number(formulario.precio)
      };

      if (formulario.id) {
        datos.id = Number(formulario.id);
        res = await axios.put("/api/servicios", datos);
        setMensajeExito("Servicio actualizado correctamente");
      } else {
        res = await axios.post("/api/servicios", datos);
        setMensajeExito("Servicio creado correctamente");
      }

      form.current.reset();
      setFormulario({
        id: "",
        nombre_servicio: "",
        precio: ""
      });
      setDetalleServicio(null);

      await fetchServicios();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setError(error.response?.data?.message || error.message || "Error al procesar la solicitud");
    } finally {
      setCargando(false);
    }
  };

  const handleDelete = async () => {
    if (!formulario.id) {
      setError("Debe seleccionar un servicio para eliminar");
      return;
    }

    setError(null);
    setMensajeExito("");
    setCargando(true);

    try {
      const res = await axios.delete("/api/servicios", {
        data: { id: Number(formulario.id) }
      });

      setMensajeExito("Servicio eliminado correctamente");

      form.current.reset();
      setFormulario({
        id: "",
        nombre_servicio: "",
        precio: ""
      });
      setDetalleServicio(null);

      await fetchServicios();
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
      setError(error.response?.data?.message || error.message || "Error al eliminar el servicio");
    } finally {
      setCargando(false);
    }
  };

  const fetchServicios = async () => {
    setCargando(true);
    setError(null);

    try {
      const res = await axios.get("/api/servicios");

      if (Array.isArray(res.data)) {
        setServicios(res.data);
      } else {
        console.error("La respuesta no es un array:", res.data);
        setServicios([]);
      }
    } catch (error) {
      console.error("Error al cargar servicios:", error);
      setError("Error al cargar la lista de servicios");
      setServicios([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  useEffect(() => {
    if (!mostrarFormulario) {
      setError(null);
      setMensajeExito("");
    }
  }, [mostrarFormulario]);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-purple-800">Gestión de Servicios</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {mensajeExito && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
          <p className="font-bold">Éxito</p>
          <p>{mensajeExito}</p>
        </div>
      )}

      <div className="bg-[#F3E5F5] border-[3px] border-yellow-500 rounded-lg p-4 shadow-lg mb-6 max-h-[240px] overflow-y-auto">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">📓 Servicios Disponibles</h2>
        {cargando && <p className="text-purple-600">Cargando servicios...</p>}

        {!cargando && servicios.length === 0 ? (
          <p className="text-purple-600">No hay servicios disponibles.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-purple-100 text-purple-800 sticky top-0">
                <th className="border p-2 bg-purple-100">ID</th>
                <th className="border p-2 bg-purple-100">Nombre</th>
                <th className="border p-2 bg-purple-100">Precio</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((servicio) => (
                <tr key={servicio.id} className="text-purple-700 hover:bg-purple-50">
                  <td className="border p-2">{servicio.id}</td>
                  <td className="border p-2">{servicio.nombre_servicio}</td>
                  <td className="border p-2">Q{servicio.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button
        onClick={() => {
          setMostrarFormulario(!mostrarFormulario);
          setTimeout(() => {
            form.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }}
        className="bg-purple-600 text-white px-4 py-2 rounded mb-4"
      >
        {mostrarFormulario ? "Ocultar Formulario" : "➕ Nuevo Servicio"}
      </button>

      {mostrarFormulario && (
        <form ref={form} onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="id" className="text-purple-800 mb-1">ID (para editar/eliminar)</label>
            <select
              id="id"
              name="id"
              onChange={handleChange}
              value={formulario.id}
              className="w-full p-2 bg-[#EDE7F6] border rounded text-purple-800"
            >
              <option value="">-- Seleccionar ID para editar --</option>
              {servicios.map(s => (
                <option key={s.id} value={s.id}>{s.id} - {s.nombre_servicio}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="nombre_servicio" className="text-purple-800 mb-1">Nombre del Servicio *</label>
            <input
              type="text"
              id="nombre_servicio"
              name="nombre_servicio"
              placeholder="Nombre del Servicio"
              onChange={handleChange}
              value={formulario.nombre_servicio}
              required
              className="w-full p-2 bg-[#EDE7F6] border rounded text-purple-800"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="precio" className="text-purple-800 mb-1">Precio *</label>
            <input
              type="number"
              id="precio"
              name="precio"
              placeholder="Precio en Quetzales"
              onChange={handleChange}
              value={formulario.precio}
              min="0"
              step="0.01"
              required
              className="w-full p-2 bg-[#EDE7F6] border rounded text-purple-800"
            />
          </div>

          <div className="flex gap-4">
            <button
              disabled={cargando}
              type="submit"
              className="bg-purple-700 hover:bg-purple-900 text-white px-4 py-2 rounded flex-1"
            >
              {cargando ? "Guardando..." : formulario.id ? "Actualizar Servicio" : "Guardar Servicio"}
            </button>

            <button
              disabled={cargando || !formulario.id}
              type="button"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded flex-1 disabled:opacity-50"
            >
              {cargando ? "Eliminando..." : "Eliminar Servicio"}
            </button>
          </div>
        </form>
      )}

      {detalleServicio && (
        <div className="mt-6 p-4 border border-purple-300 rounded bg-purple-50 text-purple-700 max-w-xl mx-auto">
          <h3 className="text-lg font-bold mb-2">Detalle del Servicio</h3>
          <p><strong>ID:</strong> {detalleServicio.id}</p>
          <p><strong>Nombre:</strong> {detalleServicio.nombre_servicio}</p>
          <p><strong>Precio:</strong> Q{detalleServicio.precio}</p>
        </div>
      )}
    </div>
  );
}
