import React from "react";

const labTests = [
  {
    name: "Full Blood Count (FBC)",
    description:
      "Evaluates your overall health and detects a wide range of disorders.",
    price: "Rs. 1,200.00",
    image: "https://cdn-icons-png.flaticon.com/512/2900/2900656.png",
  },
  {
    name: "Liver Function Test (LFT)",
    description:
      "Assesses the health of your liver by measuring proteins, enzymes, and bilirubin.",
    price: "Rs. 2,100.00",
    image: "https://cdn-icons-png.flaticon.com/512/4297/4297833.png",
  },
  {
    name: "Kidney Function Test",
    description: "Helps evaluate how well your kidneys are working.",
    price: "Rs. 1,800.00",
    image: "https://cdn-icons-png.flaticon.com/512/7065/7065902.png",
  },
  {
    name: "Thyroid Profile (T3, T4, TSH)",
    description: "Monitors thyroid hormone levels to detect imbalance.",
    price: "Rs. 2,000.00",
    image: "https://cdn-icons-png.flaticon.com/512/2941/2941624.png",
  },
  {
    name: "Lipid Profile",
    description: "Checks cholesterol and triglycerides in your blood.",
    price: "Rs. 1,500.00",
    image: "https://cdn-icons-png.flaticon.com/512/3199/3199865.png",
  },
];

const LabTestsPage = () => {
  return (
    <div className="p-20 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-8 text-blue-700">
        Lab Tests
      </h1>
      <div className="flex flex-wrap justify-center gap-6">
        {labTests.map((test, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-4 w-72 hover:shadow-xl transition-all"
          >
            <img
              src={test.image}
              alt={test.name}
              className="w-20 h-20 mx-auto mb-3"
            />
            <h2 className="text-lg font-semibold text-center text-gray-800">
              {test.name}
            </h2>
            <p className="text-sm text-gray-600 text-center">
              {test.description}
            </p>
            <p className="text-center mt-2 text-red-600 font-bold">
              {test.price}
            </p>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabTestsPage;
