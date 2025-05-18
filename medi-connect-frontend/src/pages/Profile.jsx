import { useEffect, useState } from "react";
import { getPatientsProfileInfo, handleDelete } from "./../services/patientAPI";
import apiClient from "./../services/apiClient";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editable, setEditable] = useState(false);
  const [userType, setUserType] = useState("patient");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserType(parsed.role || "patient");
    }

    const fetchProfile = async () => {
      try {
        const data = await getPatientsProfileInfo();
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!profile.age || isNaN(profile.age) || Number(profile.age) <= 0) {
      newErrors.age = "Age must be a positive number";
    }

    if (!["male", "female"].includes(profile.gender)) {
      newErrors.gender = "Gender must be 'male' or 'female'";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateProfile()) return;

    try {
      const response = await apiClient.put(
        `/profile/${profile.role}/update`,
        profile
      );
      alert("Profile updated");
      localStorage.setItem("user", JSON.stringify(profile));
      setEditable(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  if (!profile) return <p className="p-6 text-center">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-16 rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-yellow-600">My Profile</h2>

      <div className="flex justify-center">
        <img
          src={`data:image/jpeg;base64,${profile.profilePicture}`}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
        />
      </div>

      {/* Fields */}
      {["nameWithInitials", "username", "phoneNumber", "address"].map(
        (field) => (
          <div key={field}>
            <label className="block text-sm font-semibold capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              name={field}
              value={profile[field] || ""}
              onChange={handleChange}
              disabled={!editable}
              className={`w-full mt-1 p-2 border rounded ${
                editable ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>
        )
      )}

      {/* Age */}
      <div>
        <label className="block text-sm font-semibold">Age</label>
        <input
          type="number"
          name="age"
          value={profile.age || ""}
          onChange={handleChange}
          disabled={!editable}
          className={`w-full mt-1 p-2 border rounded ${
            editable ? "bg-white" : "bg-gray-100"
          } ${errors.age ? "border-red-500" : ""}`}
        />
        {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-semibold">Gender</label>
        <input
          type="text"
          name="gender"
          value={profile.gender || ""}
          onChange={handleChange}
          disabled={!editable}
          placeholder="male or female"
          className={`w-full mt-1 p-2 border rounded ${
            editable ? "bg-white" : "bg-gray-100"
          } ${errors.gender ? "border-red-500" : ""}`}
        />
        {errors.gender && (
          <p className="text-red-500 text-sm">{errors.gender}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-4 flex-wrap gap-2">
        {editable ? (
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditable(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        )}

        {userType === "doctor" && (
          <button
            onClick={() => (window.location.href = "/upload-condition-report")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Upload Condition Report
          </button>
        )}

        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Log out
        </button>

        <button
          onClick={() => handleDelete(profile)}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
