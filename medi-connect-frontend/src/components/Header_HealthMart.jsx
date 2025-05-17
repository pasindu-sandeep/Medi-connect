import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModel";

const HealthMart_Header = ({ onSearch }) => {
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <header className="fixed top-0 left-0 bg-gray-600 w-full z-20 shadow">
      <div className="flex flex-row items-center justify-between p-2 px-4">
        {/* Left: Logo & Back */}
        <div className="flex items-center space-x-2">
          <Link to="/">
            <ArrowLeft className="cursor-pointer text-white" />
          </Link>
          <img
            src="online-medical-store.png"
            className="w-12 h-12"
            alt="store"
          />
          <div className="flex flex-col pl-2">
            <h2 className="text-2xl font-bold text-yellow-400">Health Mart</h2>
            <span className="text-xs font-normal text-yellow-400">
              Medi Connect online medical store
            </span>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-grow mx-6 max-w-2xl">
          <SearchBar onSearch={onSearch} />
        </div>

        {/* Right: Cart & Profile */}
        <div className="flex items-center gap-4">
          <Link
            to="/cart"
            className="text-white hover:text-yellow-300 transition"
            title="View Cart"
          >
            <ShoppingCart className="w-8 h-8" />
          </Link>

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
              className="px-2 text-sm font-medium text-white border border-white rounded-2xl flex items-center space-x-2"
            >
              <img
                src="assets/default-avatar-profile-icon.jpg"
                alt="Default"
                className="w-5 h-5 rounded-full object-cover border-2"
              />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </header>
  );
};

export default HealthMart_Header;
