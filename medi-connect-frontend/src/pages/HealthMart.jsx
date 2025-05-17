import React from "react";
import { addToCart } from "../services/cartAPI.js";

// Move this outside if you want to share it across files
const handleAddToCart = async (product) => {
  try {
    await addToCart(product);
    alert("Item added to cart!");
  } catch (error) {
    alert("Failed to add item to cart.");
  }
};

const ProductCard = ({ product }) => {
  const { name, category, price, stock, image, sku } = product;
  const inStock = stock === "infinite" || stock > 0;

  return (
    <div className="border rounded-lg shadow p-4 w-72 bg-white relative hover:shadow-lg transition-shadow duration-300">
      <img
        src={image}
        alt={name}
        className="w-full h-40 object-contain mb-3 rounded"
      />
      <h3 className="font-semibold text-sm text-gray-800 mb-1">{name}</h3>
      <p className="text-xs text-gray-600 mb-1 italic">{category}</p>
      <p
        className={`text-sm font-semibold mb-1 ${
          inStock ? "text-green-600" : "text-red-600"
        }`}
      >
        {inStock
          ? stock === "infinite"
            ? "In stock"
            : `${stock} in stock`
          : "Out of stock"}
      </p>
      <p className="text-red-600 font-bold mb-3">{price}</p>

      {inStock ? (
        <button
          className="bg-blue-600 text-white w-full py-1 text-sm rounded hover:bg-blue-700"
          onClick={() => handleAddToCart(product)}
        >
          Add To Cart
        </button>
      ) : (
        <button className="bg-gray-400 text-white w-full py-1 text-sm rounded cursor-not-allowed">
          Read More
        </button>
      )}
      <p className="text-xs text-gray-400 mt-2">SKU: {sku}</p>
    </div>
  );
};

// ✅ Now only accepts `products` as prop
const HealthMart = ({ products }) => {
  return (
    <div className="p-6 pt-32 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap gap-6 justify-center">
        {products.length > 0 ? (
          products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))
        ) : (
          <p className="text-gray-500 text-sm mt-12">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default HealthMart;
