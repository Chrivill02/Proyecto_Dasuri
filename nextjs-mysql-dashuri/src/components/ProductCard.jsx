
'use client';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white">
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        {product.imagen ? (
          <img 
            src={product.imagen} 
            alt={product.nombre} 
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-400">Sin imagen</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.nombre}</h3>
        <p className="text-gray-600 mb-2">{product.categoria}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">${product.precio.toFixed(2)}</span>
          <span className={`px-2 py-1 rounded text-xs ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
          </span>
        </div>
        <button
          onClick={() => addToCart(product)}
          disabled={product.stock <= 0}
          className={`mt-4 w-full py-2 rounded-md ${product.stock > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {product.stock > 0 ? 'Añadir al carrito' : 'Sin stock'}
        </button>
      </div>
    </div>
  );
}
  