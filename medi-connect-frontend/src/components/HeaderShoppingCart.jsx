import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModel";

const ShoppingCart_Header = () => {
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <header className="fixed top-0 left-0 bg-gray-600 w-full z-20 shadow">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Back Button + Branding */}
        <div className="flex items-center space-x-3">
          <Link to="/">
            <ArrowLeft className="text-white cursor-pointer" />
          </Link>
          <img
            src="online-medical-store.png"
            alt="store"
            className="w-10 h-10"
          />
          <div className="text-yellow-400">
            <h2 className="text-xl font-bold">Health Mart</h2>
            <p className="text-xs">Medi Connect online medical store</p>
          </div>
        </div>

        {/* Profile/Login */}
        <div>
          {user ? (
            <Link
              to={
                user.userType === "doctor"
                  ? "/profile/doctor"
                  : "/profile/patient"
              }
              className="flex items-center gap-2 text-white"
            >
              <img
                src={
                  user.profilePicture?.startsWith("data:image")
                    ? user.profilePicture
                    : `data:image/jpeg;base64,${user.profilePicture}`
                }
                alt="User"
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
              <span className="text-sm">{user.nameWithInitials}</span>
            </Link>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 px-3 py-1 text-sm text-white border border-white rounded-full"
            >
              <img
                src="assets/default-avatar-profile-icon.jpg"
                alt="Default"
                className="w-5 h-5 rounded-full object-cover border"
              />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </header>
  );
};

export default ShoppingCart_Header;
