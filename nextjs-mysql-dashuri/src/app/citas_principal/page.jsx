// src/app/citas_principal/page.jsx
import Link from "next/link";

export default function CitasPrincipalPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold text-yellow-500 mb-8">Mis Citas</h1>

      <div className="flex gap-4 mb-10">
        <Link href="/nueva_cita">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl shadow-md">
            Nueva Cita
          </button>
        </Link>

        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-md">
          Eliminar
        </button>
      </div>

      <div className="w-full max-w-3xl h-96 bg-gray-100 border-4 border-dashed border-gray-300 rounded-xl p-6">
        <p className="text-gray-500 text-center mt-36">Aquí aparecerán tus citas (libreta).</p>
      </div>
    </div>
  );
}
