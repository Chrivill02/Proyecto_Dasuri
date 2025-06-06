"use client";
import React, { useState, useEffect } from "react";
import Buttons from "./buttons";
import ButtonAdd from "./buttonAdd";
import axios from "axios";

function ButtonBusqueda() {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Todo"); // Inicializar como "Todo"
  const [categorias, setCategorias] = useState([]);
  const [searchText, setSearchText] = useState("");

  const obtenerSoloFecha = (fechaCompleta) => {
    console.log("Fecha completa:", fechaCompleta); // Verifica qué está recibiendo
    if (!fechaCompleta) {
      console.error("Fecha no disponible");
      return "Fecha no disponible"; // Devolver un mensaje en caso de que la fecha no esté disponible
    }

    const fecha = new Date(fechaCompleta);

    // Verificamos si la fecha es válida
    if (isNaN(fecha.getTime())) {
      console.error("Fecha inválida:", fechaCompleta);
      return "Fecha inválida"; // Si la fecha es inválida, devolvemos un mensaje
    }

    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${año}-${mes}-${dia}`;
  };

  // Función para cargar los productos
  const cargaDatos = async (selectedOption) => {
    console.log("Cargando productos para la categoría:", selectedOption);
    try {
      let url = "http://localhost:3000/api/inventario";
      // Usar comparación case-insensitive
      if (selectedOption && !selectedOption.toLowerCase().includes("todo")) {
        url = `http://localhost:3000/api/categoria/${selectedOption.toLowerCase()}`;
      }

      const { data } = await axios.get(url);
      // Verificar que data es un array
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("La respuesta no es un array:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setProducts([]);
    }
  };

  // Cargar categorías al iniciar el componente
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/categoria");
        console.log("Categorías cargadas:", data); // Verificamos las categorías
        setCategorias(data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    loadCategorias();
  }, []);

  // Cargar los productos cuando cambia selectedOption
  useEffect(() => {
    console.log("selectedOption ha cambiado a:", selectedOption); // Depuración para verificar el cambio
    cargaDatos(selectedOption);
  }, [selectedOption]);

  useEffect(() => {
    console.log("selectedOption ha cambiado a:", selectedOption);
    console.log("Estado actual de productos:", products);
    cargaDatos(selectedOption);
  }, [selectedOption]);

  // Función para manejar el cambio en el dropdown
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    console.log("Dropdown toggle, isOpen:", !isOpen); // Depuración
  };

  const handleSelect = (option) => {
    console.log("Categoría seleccionada:", option);
    // Normalizar a minúsculas para la petición pero mantener visualización
    const normalizedOption = option === "Todo" ? option : option.toLowerCase();
    setSelectedOption(option); // Mostrar el nombre original
    setIsOpen(false);

    // Pasar el nombre normalizado a cargaDatos
    cargaDatos(normalizedOption);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      let url = "http://localhost:3000/api/inventario";
      if (selectedOption && !selectedOption.toLowerCase().includes("todo")) {
        url = `http://localhost:3000/api/categoria/${selectedOption.toLowerCase()}`;
      }

      const { data } = await axios.get(url);

      if (Array.isArray(data)) {
        const productosFiltrados = data.filter((producto) =>
          producto.nombre.toLowerCase().includes(searchText.toLowerCase())
        );
        setProducts(productosFiltrados);
      }
    } catch (error) {
      console.error("Error al filtrar productos:", error);
      setProducts([]);
    }
  };

  return (
    <div className="relative overflow-x-auto p-9 bg-white mt-9">
      <form onSubmit={handleSearch} className="max-w-md mx-auto">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            required
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-black border border-gray-300 rounded-lg bg-white focus:ring-purple-700 focus:border-purple-800"
            placeholder="Buscar producto"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-purple-700 font-medium rounded-lg text-sm px-4 py-2 hover:bg-purple-700 transition-colors duration-300"
          >
            Buscar
          </button>
        </div>
      </form>

      <div className="relative inline-flex">
        <button
          type="button"
          onClick={toggleDropdown}
          className="inline-flex justify-center items-center gap-2 py-3 px-6 text-sm bg-purple-700 text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-purple-800"
        >
          {selectedOption || "Todo"}
          <svg
            className={`w-2.5 h-2.5 text-white transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="rounded-xl shadow-lg bg-white absolute top-full w-72 mt-2 z-10">
            <ul className="py-2">
              {categorias.length > 0 ? (
                categorias.map((cat) => (
                  <li key={cat.id}>
                    <a
                      onClick={() => handleSelect(cat.nombre)}
                      className="block px-6 py-2 hover:bg-gray-100 text-gray-900 font-medium cursor-pointer"
                    >
                      {cat.nombre &&
                        cat.nombre.charAt(0).toUpperCase() +
                          cat.nombre.slice(1)}
                    </a>
                  </li>
                ))
              ) : (
                <li className="px-6 py-2 text-gray-500">
                  Cargando categorías...
                </li>
              )}
              <li>
                <a
                  onClick={() => handleSelect("Todo")}
                  className="block px-6 py-2 hover:bg-gray-100 text-red-500 font-medium cursor-pointer"
                >
                  Todo
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>

      <table className="w-full text-sm text-left text-black border border-gray-400 mt-5">
        <thead className="text-xs uppercase bg-white text-black border-b border-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3">
              Stock
            </th>
            <th scope="col" className="px-6 py-3">
              Precio
            </th>
            <th scope="col" className="px-6 py-3">
              Fecha de expiración
            </th>
            <th scope="col" className="px-6 py-3">
              Categoría
            </th>
            <th scope="col" className="px-6 py-3">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) &&
            products.map((product) => (
              <tr
                key={product.id}
                className="bg-white border-b border-gray-400"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-black whitespace-nowrap"
                >
                  {product.nombre &&
                    product.nombre.charAt(0).toUpperCase() +
                      product.nombre.slice(1)}
                </th>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">{product.precio}</td>
                <td className="px-6 py-4">
                  {obtenerSoloFecha(product.fecha_exp)}
                </td>
                <td className="px-6 py-4">
                  {product.categoria_nombre &&
                    product.categoria_nombre.charAt(0).toUpperCase() +
                      product.categoria_nombre.slice(1)}
                </td>
                <Buttons productId={product.id} />
              </tr>
            ))}
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"></tr>
        </tbody>
      </table>
    </div>
  );
}

export default ButtonBusqueda;
