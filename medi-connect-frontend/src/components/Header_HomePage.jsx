import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import LoginModal from "./LoginModel";

const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-700 shadow-sm shadow-gray-800 z-20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex flex-row ml-2 items-center">
              <img
                className="h-12 w-12 rounded-full"
                src="logo.png"
                alt="logo"
              />
              <div className="flex flex-col pl-4">
                <h2 className="text-xl font-bold text-yellow-400">
                  Medi-Connect
                </h2>
                <span className="text-xs text-yellow-400">
                  Connecting you with trusted doctors
                </span>
              </div>
            </div>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Nav Links */}
          <div
            className={`md:flex md:space-x-4 absolute md:relative bg-gray-700 w-full md:w-auto top-16 left-0 md:top-0 transition-all duration-300 ease-in-out ${
              menuOpen
                ? "flex flex-col space-y-4 pl-10 py-4 md:p-0"
                : "hidden md:flex"
            }`}
          >
            {[
              { to: "/", label: "Home" },
              // Only show My Bookings if not a doctor
              ...(!user || user.userType !== "doctor"
                ? [{ to: "/my-bookings", label: "My Bookings" }]
                : []),
              { to: "/health-mart", label: "Health Mart" },
              { to: "/about", label: "About" },
              { to: "/register", label: "Registration" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-2 text-sm font-medium ${
                  isActive(to) ? "text-yellow-400" : "text-white"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}

            {user?.userType === "doctor" && (
              <Link
                to={"/doctor-dashboard"}
                className={`px-3 py-2 text-sm font-medium ${
                  isActive() ? "text-yellow-400" : "text-white"
                }`}
              >
                Doctor Dashboard
              </Link>
            )}

            {/* Profile or Login Button */}
            {user ? (
              <Link
                to={
                  user.userType === "doctor"
                    ? "/profile/doctor"
                    : "/profile/patient"
                }
                className="flex items-center space-x-2 text-white pr-4"
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
                  className="w-5 h-5 rounded-full border-2 border-white shadow-md object-cover"
                />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </header>
  );
};

export default Header;
