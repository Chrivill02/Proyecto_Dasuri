"use client";
import { useEffect, useState } from "react";

function MostrarTablas() {
  const [datos, setDatos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const fetchDatos = async () => {
    const response = await fetch("/api/ComprasProveedor");
    const data = await response.json();
    setDatos(data);
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  // Filtrar datos según la búsqueda
  const datosFiltrados = datos.filter((dato) =>
    dato.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <form
      className="absolute bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4 w-[1000px] h-[400px] top-[145px] left-[480px]"
    >
      {/* Búsqueda y botón de actualizar */}
      <div className="flex justify-between items-center mb-4">
        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar proveedor..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            border: "1px solid #ccc",
            padding: "6px 10px",
            borderRadius: "4px",
            width: "250px",
          }}
        />

        {/* Botón de recarga */}
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
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Id</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Nombre</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Teléfono</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Correo</th>
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
                  {dato.id}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {dato.nombre}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {dato.telefono}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {dato.correo}
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
