import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header_HomePage.jsx";
import Home from "./pages/HomePage.jsx";
import Footer from "./components/Footer.jsx";
import DoctorRegistration from "./pages/DoctorRegistrstion.jsx";
import About from "./pages/About.jsx";
import HealthMart from "./pages/HealthMart.jsx";
import HealthPackages from "./pages/HealthPackages.jsx";
import Header_HealthMart from "./components/Header_HealthMart.jsx";
import AdminDashboard from "./pages/AdminPage.jsx";
import UserRegistration from "./pages/UserRegistration.jsx";
import HospitalRegistration from "./pages/HospitalRegister.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Profile from "./pages/Profile.jsx";
import RegistrationChoice from "./pages/RegistrationChoice .jsx";
import DoctorProfile from "./pages/DoctorProfile.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import LabTests from "./pages/LabTestsPage.jsx";
import AudioVideoConsultationPage from "./pages/AudioVideoConsultationPage.jsx";

const AppContent = () => {
  const location = useLocation();
  const hideHeaderPaths = [
    "/login",
    "/register-doctor",
    "/health-mart",
    "/admin-dashboard",
    "/patients",
    "/user-registration",
    "/hospital-registration",
    "/profile",
  ];
  const hideFooterPaths = [
    "/login",
    "/register",
    "/register-doctor",
    "/health-mart",
    "/admin-dashboard",
    "/patients",
    "/user-registration",
    "/hospital-registration",
    "/profile",
    "/my-bookings",
    "/doctor-dashboard",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideHeaderPaths.includes(location.pathname) && <Header />}
      {location.pathname === "/health-mart" && <Header_HealthMart />}
      <main className="py-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegistrationChoice />} />
          <Route path="/register-doctor" element={<DoctorRegistration />} />
          <Route path="/about" element={<About />} />
          <Route path="/health-mart" element={<HealthMart />} />
          <Route path="/health-packages" element={<HealthPackages />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-registration" element={<UserRegistration />} />
          <Route path="/profile/patient" element={<Profile />} />
          <Route path="/profile/doctor" element={<DoctorProfile />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/lab-tests" element={<LabTests />} />
          <Route
            path="/online-consultation"
            element={<AudioVideoConsultationPage />}
          />
          <Route
            path="/hospital-registration"
            element={<HospitalRegistration />}
          />
          {/* <Route path="/patients" element={<Patients />} /> */}
          {/* Add more routes as needed */}
        </Routes>
      </main>
      {!hideFooterPaths.includes(location.pathname) && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
