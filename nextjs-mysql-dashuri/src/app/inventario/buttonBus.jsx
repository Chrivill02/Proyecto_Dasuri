"use client";
import React, { useState, useEffect } from "react";
import Buttons from "./buttons";
import ButtonAdd from "./buttonAdd";
import axios from "axios";

function ButtonBusqueda() {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [categorias, setCategorias] = useState([]);

  const cargaDatos = async (selectedOption) => {
    if (
      selectedOption === "todo" ||
      selectedOption === "Todo" ||
      selectedOption === ""
    ) {
      const { data } = await axios.get("http://localhost:3000/api/inventario");
      setProducts(data);
    } else {
      const { data } = await axios.get(
        "http://localhost:3000/api/categoria/" + selectedOption
      );
      setProducts(data);
    }
  };

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/categoria");
        setCategorias(data);
        cargaDatos(selectedOption);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    loadCategorias();
  }, [selectedOption]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative overflow-x-auto p-9 bg-white mt-9">
      <div className="relative inline-flex">
        <button
          type="button"
          onClick={toggleDropdown}
          className="inline-flex justify-center items-center gap-2 py-3 px-6 text-sm bg-indigo-600 text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-indigo-700"
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
              {categorias.map((cat) => (
                <li key={cat.id}>
                  <a
                    onClick={() => handleSelect(cat.nombre)}
                    className="block px-6 py-2 hover:bg-gray-100 text-gray-900 font-medium cursor-pointer"
                  >
                    {cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1)}
                  </a>
                </li>
              ))}
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
                  {product.nombre}
                </th>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">{product.precio}</td>
                <td className="px-6 py-4">{product.categoria_nombre}</td>
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
