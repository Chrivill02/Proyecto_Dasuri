// app/page.jsx

export default function HomePage() {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <header className="w-full max-w-6xl flex justify-between items-center py-6">
          <h1 className="text-3xl font-bold text-gray-800">Mi Página de Inicio</h1>
          <nav className="space-x-4">
            <a href="#servicios" className="text-gray-600 hover:text-gray-800">Servicios</a>
            <a href="#sobre" className="text-gray-600 hover:text-gray-800">Sobre Nosotros</a>
            <a href="#contacto" className="text-gray-600 hover:text-gray-800">Contacto</a>
          </nav>
        </header>
  
        <section className="flex flex-col items-center text-center mt-20">
          <h2 className="text-4xl font-bold mb-4">Bienvenido a Nuestro Sitio</h2>
          <p className="text-lg text-gray-600 mb-8">
            Te ayudamos a alcanzar tus objetivos con soluciones innovadoras.
          </p>
          <a
            href="#contacto"
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Contáctanos
          </a>
        </section>
  
        <footer className="w-full max-w-6xl mt-24 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Mi Empresa. Todos los derechos reservados.
        </footer>
      </main>
    );
  }
  