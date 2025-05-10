import { useEffect, useState } from "react";
import {
  getPatientsProfileInfo,
  handleSave,
  handleDelete,
} from "./../services/patientAPI";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editable, setEditable] = useState(false);
  const [userType, setUserType] = useState("patient");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserType(parsed.userType || "patient");
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

      {[
        "nameWithInitials",
        "username",
        "phoneNumber",
        "address",
        "age",
        "gender",
      ].map((field) => (
        <div key={field}>
          <label className="block text-sm font-semibold">{field}</label>
          <input
            type="text"
            name={field}
            value={profile[field] || ""}
            onChange={handleChange}
            disabled={!editable}
            className="w-full mt-1 p-2 border rounded bg-gray-100"
          />
        </div>
      ))}

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
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
