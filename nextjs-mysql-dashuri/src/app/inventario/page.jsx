import axios from "axios";
import Buttons from "./buttons";
import ButtonAdd from "./buttonAdd";

async function loadProducts() {
  const { data } = await axios.get("http://localhost:3000/api/inventario");
  return data;
}

async function ViewInventario() {
  const products = await loadProducts();
  return (
    <div className="relative overflow-x-auto p-9 bg-white mt-9">
      <ButtonAdd />
      <table className="w-full text-sm text-left text-black border border-gray-400">
        <thead className="text-xs uppercase bg-white text-black border-b border-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              Nombre
            </th>
            <th scope="col" class="px-6 py-3">
              Stock
            </th>
            <th scope="col" class="px-6 py-3">
              Precio
            </th>
            <th scope="col" class="px-6 py-3">
              Categoría
            </th>
            <th scope="col" class="px-6 py-3">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr className="bg-white border-b border-gray-400" key={product.id}>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-black whitespace-nowrap"
              >
                {product.nombre}
              </th>

              <td class="px-6 py-4">{product.stock}</td>
              <td class="px-6 py-4">{product.precio}</td>
              <td class="px-6 py-4">categoria</td>
              <Buttons productId={product.id} />
            </tr>
          ))}
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"></tr>
        </tbody>
      </table>
    </div>
  );
}

export default ViewInventario;
