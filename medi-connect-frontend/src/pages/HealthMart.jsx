import React from "react";

const products = [
  {
    name: "Paracetamol 500mg (100 Tablets)",
    category: "Pain Relief, Fever",
    price: "Rs. 320.00",
    stock: 20,
    image: "healthmart/paracetamol.png",
    sku: "MED001",
  },
  {
    name: "Cetirizine 10mg (30 Tablets)",
    category: "Allergy Relief",
    price: "Rs. 180.00",
    stock: 15,
    image: "healthmart/zytec.png",
    sku: "MED002",
  },
  {
    name: "Omeprazole 20mg (14 Capsules)",
    category: "Acidity, Gastric Care",
    price: "Rs. 250.00",
    stock: 10,
    image: "healthmart/omeprazole.png",
    sku: "MED003",
  },
  {
    name: "Amoxicillin 500mg (20 Capsules)",
    category: "Antibiotic",
    price: "Rs. 450.00",
    stock: 12,
    image: "healthmart/amoxilline.png",
    sku: "MED004",
  },
  {
    name: "Ibuprofen 400mg (10 Tablets)",
    category: "Pain Relief, Anti-inflammatory",
    price: "Rs. 220.00",
    stock: 8,
    image: "healthmart/ibuprofen.png",
    sku: "MED005",
  },
  {
    name: "Metformin 500mg (30 Tablets)",
    category: "Diabetes Management",
    price: "Rs. 300.00",
    stock: 25,
    image: "healthmart/metform.png",
    sku: "MED006",
  },
  {
    name: "Loratadine 10mg (10 Tablets)",
    category: "Allergy Relief",
    price: "Rs. 160.00",
    stock: 0,
    image: "healthmart/claritin.png",
    sku: "MED007",
  },
  {
    name: "ORS Sachets (5 Packets)",
    category: "Dehydration, Electrolytes",
    price: "Rs. 140.00",
    stock: 30,
    image: "healthmart/ors.png",
    sku: "MED008",
  },
  {
    name: "Vitamin C 1000mg (20 Tablets)",
    category: "Immunity Boosters",
    price: "Rs. 350.00",
    stock: "infinite",
    image: "healthmart/vc.png",
  },
  {
    name: "Salbutamol Inhaler 100mcg",
    category: "Asthma, Respiratory Care",
    price: "Rs. 520.00",
    stock: 6,
    image: "healthmart/salbutamol.png",
    sku: "MED010",
  },
];

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
        <div className="flex gap-2">
          <button className="bg-gray-200 text-gray-800 px-3 py-1 text-sm rounded">
            -
          </button>
          <button className="bg-blue-600 text-white flex-1 py-1 text-sm rounded hover:bg-blue-700">
            Add To Cart
          </button>
        </div>
      ) : (
        <button className="bg-gray-400 text-white w-full py-1 text-sm rounded cursor-not-allowed">
          Read More
        </button>
      )}
      <p className="text-xs text-gray-400 mt-2">SKU: {sku}</p>
    </div>
  );
};

const HealthMart = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
        Health Mart
      </h1>
      <div className="flex flex-wrap gap-6 justify-center">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HealthMart;
