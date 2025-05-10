import { BarChart } from "lucide-react";
import React from "react";

const SideBar = ({ onSelectView }) => {
  return (
    <div className="fixed top-0 left-0 z-50">
      <div className="flex flex-row p-2">
        <BarChart />
        <h1>Admin Dashboard</h1>
      </div>
      <div className="w-64 p-4 bg-gray-100 min-h-screen">
        <button
          onClick={() => onSelectView("dashboard")}
          className="w-full mb-2 p-2 bg-white rounded hover:bg-gray-200"
        >
          Dashboard
        </button>
        <button
          onClick={() => onSelectView("patients")}
          className="w-full mb-2 p-2 bg-white rounded hover:bg-gray-200"
        >
          Patients
        </button>
        <button
          onClick={() => onSelectView("doctors")}
          className="w-full mb-2 p-2 bg-white rounded hover:bg-gray-200"
        >
          Doctors
        </button>
        <button
          onClick={() => onSelectView("hospitals")}
          className="w-full p-2 bg-white rounded hover:bg-gray-200"
        >
          Hospitals
        </button>
        <button
          onClick={() => onSelectView("todaysAppoinments")}
          className="w-full p-2 bg-white rounded hover:bg-gray-200"
        >
          Appointments
        </button>
      </div>
    </div>
  );
};

export default SideBar;
