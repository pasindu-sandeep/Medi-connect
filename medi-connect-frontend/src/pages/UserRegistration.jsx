import { useState } from "react";
import { Camera, Hospital } from "lucide-react";
import { registerPatient } from "./../services/patientAPI";

// Utility function to convert image file to base64 string
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]); // remove prefix
    reader.onerror = (error) => reject(error);
  });

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    profilePicture: "",
    username: "",
    password: "",
    confirmPassword: "",
    nameWithInitials: "", // formerly "fullName"
    phoneNumber: "",
    age: "",
    address: "",
    gender: "",
  });

  const [previewImage, setPreviewImage] = useState(
    "https://via.placeholder.com/100"
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await toBase64(file);
      setFormData((prev) => ({ ...prev, profilePicture: base64 }));
      setPreviewImage(URL.createObjectURL(file)); // For preview only
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerPatient(formData);
      alert("User registered successfully!");
    } catch (error) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center overflow-hidden bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-xl shadow-xl overflow-hidden"
      >
        {/* Left Panel */}
        <div className="w-full md:w-1/2 p-8 space-y-4">
          <h2 className="text-2xl text-yellow-500 font-bold mb-4">
            User Profile
          </h2>

          {/* Profile Picture */}
          <div className="flex justify-center relative mb-2">
            <label htmlFor="profilePicture" className="cursor-pointer">
              <img
                src={previewImage}
                alt="Profile Preview"
                className="w-40 h-40 rounded-full border-4 border-white shadow-md object-cover"
              />
            </label>
            <label
              htmlFor="profilePicture"
              className="absolute bottom-2 right-[42%] bg-white p-2 rounded-full shadow-md cursor-pointer"
            >
              <Camera size={16} className="text-gray-600" />
            </label>
            <input
              type="file"
              id="profilePicture"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          {/* Username */}
          <div className="relative">
            <Hospital
              className="absolute top-2.5 left-3 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Hospital
              className="absolute top-2.5 left-3 text-gray-400"
              size={18}
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Hospital
              className="absolute top-2.5 left-3 text-gray-400"
              size={18}
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-0.5 bg-gray-300"></div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-8 space-y-4">
          <h2 className="text-2xl text-yellow-500 font-bold mb-4">
            User Details
          </h2>

          {/* Full Name */}
          <div className="relative">
            <Hospital
              className="absolute top-2.5 left-3 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="nameWithInitials"
              value={formData.nameWithInitials}
              onChange={handleChange}
              placeholder="Name with Initials"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white"
            />
          </div>

          {/* Contact Number */}
          <div className="relative">
            <Hospital
              className="absolute top-2.5 left-3 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Contact Number"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white"
            />
          </div>

          {/* Age */}
          <div className="relative">
            <Hospital
              className="absolute top-2.5 left-3 text-gray-400"
              size={18}
            />
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white"
            />
          </div>

          {/* Address */}
          <div className="relative">
            <Hospital
              className="absolute top-2.5 left-3 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white"
            />
          </div>

          {/* Gender */}
          <div className="relative">
            <Hospital
              className="absolute top-2.5 left-3 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              placeholder="Gender"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-white py-2 rounded shadow-md hover:brightness-110 transition"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserRegistration;
