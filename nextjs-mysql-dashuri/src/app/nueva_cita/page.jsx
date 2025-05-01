"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function CitasFormPage() {
  const [citas, setCitas] = useState([]);
  const [detalleCita, setDetalleCita] = useState(null);
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
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });

    if (e.target.name === "id" && e.target.value) {
      const cita = citas.find((c) => c.id.toString() === e.target.value);
      setDetalleCita(cita || null);
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

      console.log(res.data);
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
      console.log(res.data);
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
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestión de Citas de Servicio</h1>
      <form ref={form} onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="id"
          placeholder="ID (para editar/eliminar)"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="fecha_cita"
          placeholder="Fecha"
          onChange={handleChange}
          value={formulario.fecha_cita}
          className="w-full p-2 border rounded"
        />
        <input
          type="time"
          name="hora_cita"
          placeholder="Hora"
          onChange={handleChange}
          value={formulario.hora_cita}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="estado"
          placeholder="Estado"
          onChange={handleChange}
          value={formulario.estado}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="costo"
          placeholder="Costo"
          onChange={handleChange}
          value={formulario.costo}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="nombre_cliente"
          placeholder="Nombre del Cliente"
          onChange={handleChange}
          value={formulario.nombre_cliente}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="telefono_cliente"
          placeholder="Teléfono del Cliente"
          onChange={handleChange}
          value={formulario.telefono_cliente}
          className="w-full p-2 border rounded"
        />

        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Guardar Cita
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-600 text-white p-2 rounded ml-4"
        >
          Eliminar Cita
        </button>
      </form>

      {detalleCita && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-bold mb-2">Detalle de la cita</h2>
          <pre>{JSON.stringify(detalleCita, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
