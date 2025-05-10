// Dashboard.jsx
import React, { useState } from "react";
import DashboardHome from "../components/dashboardComponents/DashboardHome";
import DoctorsTable from "../components/dashboardComponents/RegisteredDoctorsTable";
import PatientsTable from "../components/dashboardComponents/RegisteredPatientsTable";
import HospitalsTable from "../components/dashboardComponents/RegisteredHospitalsTable";
import TodayAppointments from "../components/dashboardComponents/TodaysAppointmentsTable";
import Sidebar from "../components/SideBar";

const AdminPage = () => {
  const [selectedView, setSelectedView] = useState("dashboard");

  const renderView = () => {
    switch (selectedView) {
      case "dashboard":
        return <DashboardHome />;
      case "doctors":
        return <DoctorsTable />;
      case "patients":
        return <PatientsTable />;
      case "hospitals":
        return <HospitalsTable />;
      case "todaysAppoinments":
        return <TodayAppointments />;
      default:
        return <div className="p-4">Select a view</div>;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onSelectView={setSelectedView} />
      <div className="flex-1 bg-gray-50">{renderView()}</div>
    </div>
  );
};

export default AdminPage;
