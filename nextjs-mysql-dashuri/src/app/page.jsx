import React from 'react';

function HomePage() {
  return (
    <div className="bg-gray-300 min-h-screen text-white flex flex-col">
      {/* Sección de portada con imagen */}
      <section className="relative w-full h-[90vh]">
        <img
          src="/fondo.avif"
          alt="Portada de maquillaje"
          className="w-full h-full object-cover object-top"
        />

        
        {/* Cuadro centrado */}
        <div className="absolute left-1/2 top-full transform -translate-x-1/2 -translate-y-1/2 w-3/5 h-48 bg-white opacity-90 p-12 text-center shadow-2xl flex flex-col justify-center">
  <h2 className="text-2xl font-bold text-black">Maquillaje Facial</h2>
  <p className="text-black mt-4">
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam temporibus laudantium lorem Lorem ipsum dolor sit amet consectetur, adipisicing elit. Numquam quas possimus tenetur hic neque incidunt praesentium culpa facere similique, alias sit! Fugit nihil minus quia, nulla ullam quibusdam dicta ex?
  </p>
</div>



        {/* Texto superpuesto sobre la imagen */}
        <div className="absolute inset-0 flex flex-col top-center items-center">
          
        <h1 
  className="text-6xl mb-4 mt-10"
  style={{ letterSpacing: "0.5em" }}
>
  DASHURI
</h1>


          <p className="text-xl">MAKE UP</p>

          <div className="flex justify-center gap-4 mt-6">
            <div className="flex justify-evenly w-full mt-6">
              <div className="flex justify-around w-full mt-6">
                <button className="bg-transparent text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-300">
                  MAQUILLAJE
                </button>

                <button className="bg-transparent text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-300">
                  SERVICIOS
                </button>

                <button className="bg-transparent text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-300">
                  CUIDADO DEL CABELLO
                </button>

                <button className="bg-transparent text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-300">
                  CUIDADO DE LA PIEL
                </button>
              </div>
			   {/* Botones con imágenes en la parte superior derecha */}
		 <div className="absolute top-4 right-4 flex gap-4">
        <button className="p-2">
          <img
            src="/buscar.png" 
            alt="Botón 1"
            className="w-10 h-10 object-contain"
          />
        </button>
        <button className="p-2">
          <img
            src="/CARRITO.jpg" 
            alt="Botón 2"
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
        </div>
      </section>

      {/* catalogo */}
      <section id="productos" className="w-full text-center py-16 bg-white text-black">
  <h2 className="text-4xl mb-8 mt-24 font-bold">Nuestros productos</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
    {/* Producto 1 */}
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <img
        src="https://thumbs.dreamstime.com/b/sistema-hermoso-del-maquillaje-del-labio-tiro-macro-horizontal-con-los-lipticks-brillantes-colecci%C3%B3n-del-maquillaje-de-los-labios-87509283.jpg"
        alt="Maquillaje"
        className="w-full h-40 object-cover rounded-lg mb-4"
      />
      <h3 className="text-2xl font-semibold text-black text-center">Maquillaje para rostro</h3>
      <p className="text-center text-black mt-2">Q300.00</p>
    </div>
    {/* Producto 2 */}
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlVZoC_KAMJRE_UB88IOyEF7AIndtIg3HKkw&s"
        alt="Maquillaje"
        className="w-full h-40 object-cover rounded-lg mb-4"
      />
      <h3 className="text-2xl font-semibold text-black text-center">Sombras de ojos</h3>
      <p className="text-center text-black mt-2">Q200.00</p>
    </div>
    {/* Producto 3 */}
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <img
        src="https://thumbs.dreamstime.com/b/conjunto-horizontal-de-productos-maquillaje-con-fondo-blanco-y-sombra-suave-%C3%BAtil-para-banner-268828214.jpg?w=1600"
        alt="Maquillaje"
        className="w-full h-40 object-cover rounded-lg mb-4"
      />
      <h3 className="text-2xl font-semibold text-black text-center">Labiales</h3>
      <p className="text-center text-black mt-2">Q150.00</p>
    </div>

    {/* Producto 1 */}
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcPFcq5EXbSZ5QOYUR6_D8bzjf8V2iBpxYww&s"
        alt="Maquillaje"
        className="w-full h-40 object-cover rounded-lg mb-4"
      />
      <h3 className="text-2xl font-semibold text-black text-center">Maquillaje para rostro</h3>
      <p className="text-center text-black mt-2">Q300.00</p>
    </div>
    {/* Producto 2 */}
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyNe5XzVson3g633EWsBtBgl7oe-m2W0M82Q&s"
        alt="Maquillaje"
        className="w-full h-40 object-cover rounded-lg mb-4"
      />
      <h3 className="text-2xl font-semibold text-black text-center">Sombras de ojos</h3>
      <p className="text-center text-black mt-2">Q200.00</p>
    </div>
    {/* Producto 3 */}
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <img
        src="https://previews.123rf.com/images/kopitinphoto/kopitinphoto1509/kopitinphoto150900169/44958592-establecer-cosm%C3%A9ticos-de-maquillaje-polvo-compacto-base-mineral-y-pinceles-de-maquillaje.jpg"
        alt="Maquillaje"
        className="w-full h-40 object-cover rounded-lg mb-4"
      />
      <h3 className="text-2xl font-semibold text-black text-center">Labiales</h3>
      <p className="text-center text-black mt-2">Q150.00</p>
    </div>
  </div>
</section>


      {/* Imagen al final con fondo negro translúcido */}
      <div className="relative mt-20 w-full h-140">
        <img
          src="/imagen_final.JPG"
          alt="Imagen final"
          className="w-full h-full object-cover inset-0"
        />
        <div className="absolute inset-0 flex flex-col top-center items-center bg-black opacity-50"></div>

		




  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-3xl mx-auto p-6 text-center">
  {/* Texto encima del cuadro */}
  <p className="absolute -top-50 left-1/3	transform -translate-x-1/2 text-white text-7xl font-bold bg-transparent">
    ¡PORQUE TÚ LO VALES!
  </p>
</div>






      </div>
    </div>
  );
}

export default HomePage;
