
	import React from 'react';

	function HomePage() {
	return (
		<div className="bg-purple-700 min-h-screen text-white flex flex-col">
		{/* Sección de portada con imagen */}
		<section className="relative w-full h-[80vh]">
			<img
			src="/fondo.avif"
			alt="Portada de maquillaje"
			className="w-full h-full object-cover"
			/>
			{/* Texto superpuesto sobre la imagen */}
			<div className="absolute inset-0 flex flex-col top-center items-center bg-black opacity-50">
			<h1 className="text-5xl font-bold mb-4">DASHURI</h1>
			<p className="text-xl">MAKE UP</p>


			<div className="flex justify-center gap-4 mt-6">
        <button className="bg-transparent-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-300">
        MAQUILLAJE
        </button>

        <button className="bg-transparent-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-300">
        SERVICIOS
        </button>

		<button className="bg-transparent-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-300">
        CUIDADO DEL CABELLO
        </button>

		<button className="bg-transparent-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-300">
        CUIDADO DE LA PIEL
        </button>

		 {/* Botones con imágenes en la parte superior derecha */}
		 <div className="absolute top-4 right-4 flex gap-4">
        <button className="p-2">
          <img
            src="/CARRITO.JPG" 
            alt="Botón 1"
            className="w-10 h-10 object-contain"
          />
        </button>
        <button className="p-2">
          <img
            src="/usuario.jpg" 
            alt="Botón 2"
            className="w-10 h-10 object-contain"
          />
        </button>
      </div>
      </div>
			</div>


		</section>



		{/* Resto del contenido */}
		<section id="productos" className="w-full text-center py-16 bg-purple-800">
			<h2 className="text-4xl text-white mb-8">Nuestros productos</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
			{/* Producto 1 */}
			<div className="bg-white p-4 rounded-lg shadow-lg">
				<img
				src="https://via.placeholder.com/300"
				alt="Maquillaje"
				className="w-full h-40 object-cover rounded-lg mb-4"
				/>
				<h3 className="text-2xl font-semibold text-center">Maquillaje para rostro</h3>
				<p className="text-center text-gray-700 mt-2">$30.00</p>
			</div>
			{/* Producto 2 */}
			<div className="bg-white p-4 rounded-lg shadow-lg">
				<img
				src="https://via.placeholder.com/300"
				alt="Maquillaje"
				className="w-full h-40 object-cover rounded-lg mb-4"
				/>
				<h3 className="text-2xl font-semibold text-center">Sombras de ojos</h3>
				<p className="text-center text-gray-700 mt-2">$20.00</p>
			</div>
			{/* Producto 3 */}
			<div className="bg-white p-4 rounded-lg shadow-lg">
				<img
				src="https://via.placeholder.com/300"
				alt="Maquillaje"
				className="w-full h-40 object-cover rounded-lg mb-4"
				/>
				<h3 className="text-2xl font-semibold text-center">Labiales</h3>
				<p className="text-center text-gray-700 mt-2">$15.00</p>
			</div>
			</div>
		</section>


		{/* Imagen al final con fondo negro translúcido */}
		<div className="relative mt-20">
        <div className="w-full h-96 bg-black bg-opacity-50">
          <img
            src="/imagen_final.JPG" // Cambia esta URL por la URL de tu imagen
            alt="Imagen final"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
		</div>
	);
	}

	export default HomePage;
