"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function CitasFormPage() {
  const [citas, setCitas] = useState([]);
  const [detalleCita, setDetalleCita] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
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
        setFormulario({
          id: cita.id.toString(),
          fecha_cita: cita.fecha_cita || "",
          hora_cita: cita.hora_cita || "",
          estado: cita.estado || "",
          costo: cita.costo ? cita.costo.toString() : "",
          nombre_cliente: cita.nombre_cliente || "",
          telefono_cliente: cita.telefono_cliente || ""
        });
      } else {
        setDetalleCita(null);
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
    } catch (error) {
      console.error("Error al cargar citas:", error);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-purple-800">Gestión de Citas de Servicio</h1>

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
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita.id} className="text-purple-700 hover:bg-purple-50">
                <td className="border p-2">{cita.id}</td>
                <td className="border p-2">{cita.fecha_cita}</td>
                <td className="border p-2">{cita.hora_cita}</td>
                <td className="border p-2">{cita.estado}</td>
                <td className="border p-2">${cita.costo}</td>
                <td className="border p-2">{cita.nombre_cliente}</td>
                <td className="border p-2">{cita.telefono_cliente}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
        className="bg-purple-600 text-white px-4 py-2 rounded mb-4"
      >
        {mostrarFormulario ? "Ocultar Formulario" : "➕ Nueva Cita"}
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
              {citas.map(c => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.nombre_cliente}
                </option>
              ))}
            </select>
          </div>

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
          </div>
        </form>
      )}

      {detalleCita && (
        <div className="mt-6 p-4 border rounded bg-purple-50 text-purple-800">
          <h2 className="font-bold mb-2">Detalle de la cita</h2>
          <pre>{JSON.stringify(detalleCita, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
