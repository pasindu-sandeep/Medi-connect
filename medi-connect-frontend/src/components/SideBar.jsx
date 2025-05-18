import {
  BarChart,
  Users,
  UserCheck,
  Hospital,
  CalendarCheck,
  ShoppingCart,
} from "lucide-react";
import React from "react";

const SideBar = ({ onSelectView }) => {
  return (
    <aside className="fixed top-0 left-0 z-50 w-64 h-screen bg-white shadow-md border-r">
      <div className="flex items-center gap-2 p-4 border-b">
        <BarChart className="text-blue-600" />
        <h1 className="font-bold text-xl text-blue-600">Admin Dashboard</h1>
      </div>
      <nav className="flex flex-col p-4 gap-2">
        <button
          onClick={() => onSelectView("dashboard")}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100"
        >
          <BarChart className="w-4 h-4" /> Dashboard
        </button>
        <button
          onClick={() => onSelectView("patients")}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100"
        >
          <Users className="w-4 h-4" /> Patients
        </button>
        <button
          onClick={() => onSelectView("doctors")}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100"
        >
          <UserCheck className="w-4 h-4" /> Doctors
        </button>
        <button
          onClick={() => onSelectView("hospitals")}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100"
        >
          <Hospital className="w-4 h-4" /> Hospitals
        </button>
        <button
          onClick={() => onSelectView("todaysAppoinments")}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100"
        >
          <CalendarCheck className="w-4 h-4" /> Appointments
        </button>
        <button
          onClick={() => onSelectView("customerOrders")}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-100"
        >
          <ShoppingCart className="w-4 h-4" /> Customer Orders
        </button>
      </nav>
      <div className="absolute bottom-0 left-0 w-full p-4 border-t bg-white">
        <button
          onClick={() => {
            sessionStorage.setItem("adminNavigated", "true");
            // Add your logout logic here
            if (typeof window !== "undefined") {
              localStorage.clear();
              window.location.href = "/";
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-red-100 text-red-600 hover:bg-red-200 font-semibold"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
