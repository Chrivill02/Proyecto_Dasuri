'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegistrarPage() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [nivel, setNivel] = useState('0')  // Por defecto el nivel es 0 (usuario)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userNivel, setUserNivel] = useState(null)  // Para guardar el nivel del usuario logueado

  const router = useRouter()

  useEffect(() => {
    // Obtener el nivel desde localStorage
    const nivel = localStorage.getItem('usuarioNivel');
    setUserNivel(parseInt(nivel));  // Guardamos el nivel en el estado
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      // Enviar los datos al backend, incluyendo el nivel
      const res = await fetch('/api/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, telefono, contraseña, nivel: parseInt(nivel) }), // Convertimos el nivel a entero
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Error al registrar')

      setSuccess('Usuario registrado con éxito')
      setNombre('')
      setEmail('')
      setTelefono('')
      setContraseña('')
      setNivel('0')  // Resetear el nivel al valor por defecto

      setTimeout(() => {
        router.push('/ventas') // Redirigir después de 2 segundos
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Registrar Usuario</h2>

        {error && <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border rounded"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </div>

          {/* Si el usuario es admin, mostrar el campo de nivel */}
          {userNivel === 1 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
              <select
                className="w-full px-3 py-2 border rounded"
                value={nivel} // Vinculamos el valor del select al estado "nivel"
                onChange={(e) => setNivel(e.target.value)} // Actualizamos el estado al cambiar
                required
              >
                <option value="0">Usuario</option>
                <option value="1">Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
