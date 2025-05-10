import { useNavigate } from "react-router-dom";
import { Hospital, UserPlus, Stethoscope, ArrowLeft } from "lucide-react";

const RegistrationChoice = () => {
  const navigate = useNavigate();

  const options = [
    {
      label: "Patient Registration",
      icon: <UserPlus size={28} />,
      path: "/user-registration",
      color: "from-green-400 to-green-600",
    },
    {
      label: "Doctor Registration",
      icon: <Stethoscope size={28} />,
      path: "/register-doctor",
      color: "from-blue-400 to-blue-600",
    },
    {
      label: "Hospital Registration",
      icon: <Hospital size={28} />,
      path: "/hospital-registration",
      color: "from-yellow-400 to-yellow-600",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 p-6">
      <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-3xl text-center relative">
        {/* Go Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-sm text-gray-600 hover:text-blue-600 flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" />
          Go Back
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Select Registration Type
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => navigate(opt.path)}
              className={`flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-r ${opt.color} text-white shadow-md hover:scale-105 transition-all`}
            >
              {opt.icon}
              <span className="mt-3 font-semibold">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegistrationChoice;
