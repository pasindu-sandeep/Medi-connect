import React, { useState } from "react";
import Header_HealthMart from "../components/Header_HealthMart";
import HealthMart from "./HealthMart"; // Your product grid

const allProducts = [
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
    sku: "MED011",
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

const HealthMartWrapper = () => {
  const [products, setProducts] = useState(allProducts);

  const handleSearch = (query) => {
    const filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setProducts(filtered);
  };

  return (
    <>
      <Header_HealthMart onSearch={handleSearch} />
      <HealthMart products={products} />
    </>
  );
};

export default HealthMartWrapper;
