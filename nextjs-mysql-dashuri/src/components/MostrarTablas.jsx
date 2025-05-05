"use client"
import { useEffect, useState } from "react";


function mostrartablas() {
    const [datos, setDatos] = useState([]);

    useEffect(() => {
        async function fetchDatos() {
          const response = await fetch('/api/ComprasProveedor', datos); // <-- ruta de tu API
          const data = await response.json();
          setDatos(data);
        }
    
        fetchDatos();
      }, []);


    return (
        <form 
        className="absolute bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4 w-[1000px] h-[350px] top-[350px] left-[170px]" //x máx 1195 y máx 441
        ><div style={{ padding: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#A74BE3', color: 'white' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Id</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nombre</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Telefono</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Correo</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((dato, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white' }}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dato.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dato.nombre}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dato.telefono}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dato.correo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
            

        </form>

        
    );
}

export default mostrartablas;