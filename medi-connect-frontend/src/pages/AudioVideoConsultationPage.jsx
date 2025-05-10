import React from "react";

const services = [
  {
    title: "General Consultation",
    description:
      "Speak with a certified general practitioner about common health concerns.",
    price: "Rs. 1,000.00",
    icon: "📞",
  },
  {
    title: "Pediatric Care",
    description:
      "Consult with pediatricians regarding your child's health and wellness.",
    price: "Rs. 1,200.00",
    icon: "👶",
  },
  {
    title: "Dermatology",
    description:
      "Get advice for skin issues, rashes, or cosmetic concerns from dermatologists.",
    price: "Rs. 1,500.00",
    icon: "💆‍♂️",
  },
  {
    title: "Mental Health Support",
    description:
      "Speak confidentially with a licensed psychologist or counselor.",
    price: "Rs. 2,000.00",
    icon: "🧠",
  },
  {
    title: "Nutrition Advice",
    description:
      "Connect with certified dietitians to improve your diet and lifestyle.",
    price: "Rs. 900.00",
    icon: "🥗",
  },
];

const AudioVideoConsultationPage = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-8">
        Audio / Video Consultations
      </h1>
      <div className="flex flex-wrap justify-center gap-6">
        {services.map((svc, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 w-72 text-center hover:shadow-xl transition-all"
          >
            <div className="text-4xl mb-2">{svc.icon}</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {svc.title}
            </h2>
            <p className="text-sm text-gray-600 mb-3">{svc.description}</p>
            <p className="text-red-600 font-bold mb-4">{svc.price}</p>
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioVideoConsultationPage;
