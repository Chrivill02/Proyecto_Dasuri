"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CitasPrincipal() {
  const router = useRouter();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para el formulario
  const [formMode, setFormMode] = useState('create'); // 'create' o 'edit'
  const [formData, setFormData] = useState({
    id: null,
    fecha_cita: '',
    hora_cita: '',
    estado: 'Pendiente', // Valor por defecto
    costo: '',
    nombre_cliente: '',
    telefono_cliente: ''
  });

  // Opciones para el estado de la cita
  const estadoOptions = ['Pendiente', 'Confirmada', 'Cancelada', 'Completada'];

  // Cargar citas al montar el componente
  useEffect(() => {
    fetchCitas();
  }, []);

  // Función para obtener todas las citas
  const fetchCitas = async () => {
    try {
      setLoading(true);
      setError(null);
      setErrorDetails(null);
  
      const response = await fetch('/api/nueva_cita');
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Error HTTP ${response.status} al cargar las citas`
        );
      }
  
      const data = await response.json();
      setCitas(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error('Error al cargar citas:', err);
      setError(err.message);
      setErrorDetails({
        status: err.status,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
      });
    } finally {
      setLoading(false);
    }
  };
  

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Resetear el formulario
  const resetForm = () => {
    setFormData({
      id: null,
      fecha_cita: '',
      hora_cita: '',
      estado: 'Pendiente',
      costo: '',
      nombre_cliente: '',
      telefono_cliente: ''
    });
    setFormMode('create');
  };

  // Preparar formulario para editar
  const handleEdit = (cita) => {
    setFormData({
      id: cita.id,
      fecha_cita: cita.fecha_cita.split('T')[0], // Formatear fecha
      hora_cita: cita.hora_cita,
      estado: cita.estado,
      costo: cita.costo,
      nombre_cliente: cita.nombre_cliente,
      telefono_cliente: cita.telefono_cliente || ''
    });
    setFormMode('edit');
    // Desplazar al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Validar campos del formulario
      if (!formData.fecha_cita || !formData.hora_cita || !formData.estado || !formData.costo || !formData.nombre_cliente) {
        throw new Error('Por favor complete todos los campos requeridos');
      }

      // URL y método según modo
      const url = '/api/nueva_cita';
      const method = formMode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al procesar la cita');
      }
      
      // Actualizar lista de citas
      fetchCitas();
      // Resetear formulario
      resetForm();
      
      alert(formMode === 'create' ? 'Cita creada con éxito' : 'Cita actualizada con éxito');
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar cita
  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar esta cita?')) return;
    
    try {
      setLoading(true);
      const response = await fetch('/api/nueva_cita', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al eliminar la cita');
      }
      
      // Actualizar lista de citas
      fetchCitas();
      alert('Cita eliminada con éxito');
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Gestión de Citas</h1>
      
      {/* Formulario de cita */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {formMode === 'create' ? 'Nueva Cita' : 'Editar Cita'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fecha_cita"
                value={formData.fecha_cita}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            
            {/* Hora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="hora_cita"
                value={formData.hora_cita}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            
            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                {estadoOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            {/* Costo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Costo <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="costo"
                value={formData.costo}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            {/* Nombre del cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Cliente <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre_cliente"
                value={formData.nombre_cliente}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            
            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono_cliente"
                value={formData.telefono_cliente}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Opcional"
              />
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Procesando...' : formMode === 'create' ? 'Crear Cita' : 'Actualizar Cita'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Tabla de citas */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b">Lista de Citas</h2>
        
        {loading && <p className="text-center p-4">Cargando citas...</p>}
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && citas.length === 0 && (
          <p className="text-center p-4 text-gray-500">No hay citas registradas</p>
        )}
        
        {!loading && citas.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {citas.map((cita) => (
                  <tr key={cita.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(cita.fecha_cita)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cita.hora_cita}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cita.nombre_cliente}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cita.telefono_cliente || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${cita.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${cita.estado === 'Confirmada' ? 'bg-blue-100 text-blue-800' : ''}
                        ${cita.estado === 'Cancelada' ? 'bg-red-100 text-red-800' : ''}
                        ${cita.estado === 'Completada' ? 'bg-green-100 text-green-800' : ''}
                      `}>
                        {cita.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">${parseFloat(cita.costo).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEdit(cita)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(cita.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}