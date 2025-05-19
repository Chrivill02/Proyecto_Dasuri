"use client";
import { useEffect, useState } from "react";
import axios from "axios";

function MostrarTablas() {
  const [datos, setDatos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDatos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/factura");
      const data = await response.json();

      // Ya no filtramos aquí por estado, guardamos todo
      setDatos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDatos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const handleEstadoChange = async (id, newEstado, compraData) => {
    try {
      // Actualizar el estado de la solicitud
      alert(newEstado)
      await axios.put(`/api/factura/${id}`, { estado: newEstado });

      if (newEstado === "Recibido") {
        // Obtener ID de categoría desde su nombre
        const res = await axios.get(`/api/obtenerIDcategoria/${encodeURIComponent(compraData.categoria_nombre)}`);
        const categoriaid = res.data.id;

        // Enviar los detalles de la compra a la base de datos de inventario
        await axios.post("/api/inventario", {
          nombre: compraData.producto,
          stock: compraData.cantidad,
          precio: compraData.precio,
          categoria_id: categoriaid,
          fecha_exp: compraData.fecha_vencimiento,
        });

        alert("Estado actualizado a Recibido y producto agregado al inventario");
      }

      // Actualizar estado localmente sin volver a llamar a fetch
      setDatos((prev) =>
        prev.map((item) =>
          item.solicitud_id === id ? { ...item, estado: newEstado } : item
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  const datosFiltrados = datos.filter((dato) => {
    if (!dato || !dato.producto) return false;
    return dato.producto.toLowerCase().includes(busqueda.toLowerCase());
  });

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <form className="absolute bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4 w-[1000px] h-[400px] top-[20px] left-[250px]">
      {/* Búsqueda y botón de actualizar */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            border: "1px solid #ccc",
            padding: "6px 10px",
            borderRadius: "4px",
            width: "250px",
          }}
        />

        <button
          type="button"
          onClick={fetchDatos}
          style={{
            backgroundColor: "#A74BE3",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "18px",
          }}
          title="Actualizar"
        >
          🔄
        </button>
      </div>

      {/* Contenedor con scroll */}
      <div style={{ maxHeight: "300px", overflow: "auto", padding: "4px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#A74BE3", color: "white" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID Compra</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Producto</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Cantidad</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Precio</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Categoría</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Proveedor</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Fecha Vencimiento</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.map((dato, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white",
                }}
              >
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {dato.compra_id}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {dato.producto}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {dato.cantidad}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {dato.precio}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {dato.categoria_nombre}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {dato.proveedor_nombre}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {dato.fecha_vencimiento}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <select
                    value={dato.estado}
                    onChange={(e) =>
                      handleEstadoChange(dato.solicitud_id, e.target.value, dato)
                    }
                    style={{
                      backgroundColor:
                        dato.estado === "En espera..." ? "#f9c74f" : "#90be6d",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    <option value="En espera...">En espera...</option>
                    <option value="Recibido">Recibido</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
}

export default MostrarTablas;
