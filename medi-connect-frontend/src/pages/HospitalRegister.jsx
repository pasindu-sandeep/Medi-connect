import { useState } from "react";
import { Camera, Hospital } from "lucide-react";
import { registerHospital } from "../services/hospitalInfoAPI";

// Convert image file to base64 string
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]); // remove data:image/... prefix
    reader.onerror = (error) => reject(error);
  });

const HospitalRegistration = () => {
  const [previewImage, setPreviewImage] = useState("hospital.png");
  const [formData, setFormData] = useState({
    hospitalName: "",
    address: "",
    contact: "",
    coverPhoto: "",
    labServices: [],
    healthPackages: [],
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.hospitalName.trim())
      newErrors.hospitalName = "Hospital name is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.contact.trim())
      newErrors.contact = "Contact number is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCoverPhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await toBase64(file);
      setFormData({ ...formData, coverPhoto: base64 });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAddLabService = () => {
    setFormData({
      ...formData,
      labServices: [
        ...formData.labServices,
        { name: "", description: "", price: "" },
      ],
    });
  };

  const handleLabServiceChange = (index, field, value) => {
    const updated = [...formData.labServices];
    updated[index][field] = value;
    setFormData({ ...formData, labServices: updated });
  };

  const handleAddHealthPackage = () => {
    setFormData({
      ...formData,
      healthPackages: [
        ...formData.healthPackages,
        { packageName: "", description: "", price: "" },
      ],
    });
  };

  const handleHealthPackageChange = (index, field, value) => {
    const updated = [...formData.healthPackages];
    updated[index][field] = value;
    setFormData({ ...formData, healthPackages: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      labServices: formData.labServices.map((s) => ({
        ...s,
        price: parseFloat(s.price),
      })),
      healthPackages: formData.healthPackages.map((p) => ({
        ...p,
        price: parseFloat(p.price),
      })),
    };

    try {
      await registerHospital(payload);
      alert("Hospital registered successfully!");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Failed to register hospital.");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center overflow-hidden bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-xl shadow-xl overflow-hidden"
      >
        {/* Left Panel */}
        <div className="w-full md:w-1/2 p-8 space-y-4">
          <h2 className="text-2xl text-yellow-500 font-bold mb-4">
            Hospital Details
          </h2>

          {/* Cover Photo */}
          <div className="flex justify-center relative mb-2">
            <label htmlFor="coverPhoto" className="cursor-pointer">
              <img
                src={previewImage}
                alt="Cover"
                className="w-full h-auto object-cover rounded-md border shadow-md"
              />
            </label>
            <label
              htmlFor="coverPhoto"
              className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer"
            >
              <Camera size={16} className="text-gray-600" />
            </label>
            <input
              type="file"
              id="coverPhoto"
              className="hidden"
              onChange={handleCoverPhotoChange}
              accept="image/*"
            />
          </div>

          {/* Hospital Name */}
          {/* Hospital Name */}
          <div className="relative">
            <Hospital
              className="absolute top-2.5 left-3 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              placeholder="Hospital Name"
              className={`w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white ${
                errors.hospitalName ? "border border-red-500" : ""
              }`}
            />
            {errors.hospitalName && (
              <p className="text-red-500 text-sm mt-1">{errors.hospitalName}</p>
            )}
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
              className={`w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white ${
                errors.address ? "border border-red-500" : ""
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* Contact */}
          <div className="relative">
            <Hospital
              className="absolute top-2.5 left-3 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Contact Number"
              className={`w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white ${
                errors.contact ? "border border-red-500" : ""
              }`}
            />
            {errors.contact && (
              <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-0.5 bg-gray-300"></div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-8 space-y-6 overflow-y-auto max-h-[90vh]">
          <h2 className="text-2xl text-yellow-500 font-bold">
            Services & Packages
          </h2>

          {/* Lab Services */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Lab Services
            </h3>
            {formData.labServices.map((service, index) => (
              <div key={index} className="space-y-2 mb-3">
                <input
                  type="text"
                  placeholder="Service Name"
                  value={service.name}
                  onChange={(e) =>
                    handleLabServiceChange(index, "name", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded bg-gray-50"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={service.description}
                  onChange={(e) =>
                    handleLabServiceChange(index, "description", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded bg-gray-50"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={service.price}
                  onChange={(e) =>
                    handleLabServiceChange(index, "price", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded bg-gray-50"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddLabService}
              className="text-blue-600 hover:underline text-sm"
            >
              + Add Lab Service
            </button>
          </div>

          {/* Health Packages */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Health Packages
            </h3>
            {formData.healthPackages.map((pkg, index) => (
              <div key={index} className="space-y-2 mb-3">
                <input
                  type="text"
                  placeholder="Package Name"
                  value={pkg.packageName}
                  onChange={(e) =>
                    handleHealthPackageChange(
                      index,
                      "packageName",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border rounded bg-gray-50"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={pkg.description}
                  onChange={(e) =>
                    handleHealthPackageChange(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border rounded bg-gray-50"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={pkg.price}
                  onChange={(e) =>
                    handleHealthPackageChange(index, "price", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded bg-gray-50"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddHealthPackage}
              className="text-blue-600 hover:underline text-sm"
            >
              + Add Health Package
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-white py-2 rounded shadow-md hover:brightness-110 transition"
          >
            Register Hospital
          </button>
        </div>
      </form>
    </div>
  );
};

export default HospitalRegistration;
