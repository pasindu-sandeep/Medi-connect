import React, { useState } from "react";

// Mock data
const packages = [
  {
    id: 1,
    name: "General Health Check-Up",
    description: "Comprehensive check for overall health status.",
    tests: [
      "Full Blood Count",
      "Fasting Blood Sugar",
      "Lipid Profile",
      "Liver Function Tests",
      "Urine Analysis",
      "Chest X-ray",
      "ECG",
      "Doctor Consultation",
    ],
    hospitals: [
      {
        name: "Asiri Health",
        price: "Rs. 4,500",
        requirements: "Fasting required for 10 hours",
      },
      {
        name: "Lanka Hospitals",
        price: "Rs. 5,200",
        requirements: "Bring previous medical records",
      },
    ],
  },
  {
    id: 2,
    name: "Diabetes Screening Package",
    description: "Essential tests for diabetes diagnosis and monitoring.",
    tests: [
      "Fasting & Postprandial Blood Sugar",
      "HbA1c",
      "Kidney Function Test",
      "Eye Check",
      "Foot Exam",
    ],
    hospitals: [
      {
        name: "Hemas Hospitals",
        price: "Rs. 3,900",
        requirements: "Minimum 8 hours fasting",
      },
      {
        name: "Kings Hospital",
        price: "Rs. 4,100",
        requirements: "No food or drink before test",
      },
    ],
  },
];

const HealthPackages = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Package List */}
      <h2 className="text-2xl font-bold mb-4">Available Health Packages</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => setSelectedPackage(pkg)}
            className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer transition"
          >
            <h3 className="font-semibold text-lg">{pkg.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
          </div>
        ))}
      </div>

      {/* Selected Package Details */}
      {selectedPackage && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">{selectedPackage.name}</h3>
          <p className="text-gray-700 mb-4">{selectedPackage.description}</p>

          <h4 className="font-semibold mb-2">Included Tests:</h4>
          <ul className="list-disc list-inside mb-6 text-gray-700">
            {selectedPackage.tests.map((test, index) => (
              <li key={index}>{test}</li>
            ))}
          </ul>

          <h4 className="font-semibold mb-2">Available at:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedPackage.hospitals.map((hospital, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg shadow-sm bg-gray-50"
              >
                <p className="font-semibold">{hospital.name}</p>
                <p className="text-red-600 font-bold">{hospital.price}</p>
                <p className="text-sm text-gray-600">{hospital.requirements}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthPackages;
