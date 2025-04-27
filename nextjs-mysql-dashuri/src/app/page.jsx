	// src/app/page.jsx
	import React from 'react';

	function HomePage() {
	return (
		<div className="bg-purple-700 min-h-screen text-white flex flex-col">
		{/* Sección de portada con imagen */}
		<section className="relative w-full h-80">
			<img
			src="/fondo.avif" // Cambia esta URL por la URL de tu imagen
			alt="Portada de maquillaje"
			className="w-full h-full object-cover"
			/>
			{/* Texto superpuesto sobre la imagen */}
			<div className="absolute inset-0 flex flex-col justify-center items-center bg-black opacity-50">
			<h1 className="text-5xl font-bold mb-4">DASHURI</h1>
			<p className="text-xl">MAKE UP</p>
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
		</div>
	);
	}

	export default HomePage;
