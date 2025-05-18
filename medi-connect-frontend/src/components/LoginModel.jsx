import { useState } from "react";
import { loginUser } from "./../services/loginAPI";
import { useNavigate } from "react-router-dom";

// Helper to determine user type
const determineUserType = (user) => {
  const isDoctor =
    user.gender?.toLowerCase() === "unknown" &&
    user.address?.toLowerCase() === "unknown";
  return isDoctor ? "doctor" : "patient";
};

const LoginModal = ({ show, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  if (!show) return null;

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Please enter both username and password.");
      return;
    }

    if (username == "admin" || password == "admin") {
      sessionStorage.setItem("adminNavigated", "true");
      navigate("/admin-dashboard");
    } else {
      try {
        const data = await loginUser(username, password);
        const userType = determineUserType(data);

        const userData = { ...data, userType };
        localStorage.setItem("user", JSON.stringify(userData));

        onClose();

        // Redirect based on user type
        window.location.href =
          userType === "doctor" ? "/profile/doctor" : "/profile/patient";
      } catch (err) {
        alert("Login failed. Please try again.");
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">Login</h2>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full p-2 mt-3 border rounded-md"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full p-2 mt-3 border rounded-md"
        />

        <button
          onClick={handleLogin}
          className="mt-4 w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>

        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl"
          onClick={onClose}
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
