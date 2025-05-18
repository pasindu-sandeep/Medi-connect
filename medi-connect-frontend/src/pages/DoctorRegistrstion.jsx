import { useState, useEffect } from "react";
import {
  Camera,
  User,
  Lock,
  UserCircle,
  Phone,
  BriefcaseMedical,
  CalendarClock,
  Hospital,
} from "lucide-react";
import { getHospitalList } from "../services/hospitalInfoAPI";
import { registerDoctor } from "../services/doctorInfoAPI";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const DoctorRegistration = () => {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const hospitalData = await getHospitalList();
        setHospitals(hospitalData);
      } catch (error) {
        console.error("Failed to fetch hospitals:", error);
      }
    };

    fetchHospitals();
  }, []);

  const initializeSchedule = () =>
    daysOfWeek.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {});

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
    doctorID: "",
    specialization: "",
    contactNumber: "",
    profilePicture: "",
    schedule: initializeSchedule(),
  });

  const [previewProfilePicture, setPreviewImage] = useState(
    "avatars/male_avatar.png"
  );
  const [previewDoctorID, setDoctorID] = useState("id_card.png");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIDChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await toBase64(file);
      setFormData((prev) => ({ ...prev, doctorID: base64 }));
      setDoctorID(base64);
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await toBase64(file);
      setFormData((prev) => ({ ...prev, profilePicture: base64 }));
      setPreviewImage(base64);
    }
  };

  const handleScheduleChange = (day, index, field, value) => {
    const updatedDaySchedule = [...formData.schedule[day]];
    updatedDaySchedule[index][field] = value;

    setFormData({
      ...formData,
      schedule: {
        ...formData.schedule,
        [day]: updatedDaySchedule,
      },
    });
  };

  const addTimeSlot = (day) => {
    const newSlot = { hospital: "", startTime: "", endTime: "" };
    setFormData({
      ...formData,
      schedule: {
        ...formData.schedule,
        [day]: [...formData.schedule[day], newSlot],
      },
    });
  };

  const removeTimeSlot = (day, index) => {
    const updatedSlots = formData.schedule[day].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      schedule: {
        ...formData.schedule,
        [day]: updatedSlots,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const schedule = {
      doctorUserName: formData.username,
    };

    daysOfWeek.forEach((day) => {
      const key = `availabilityList_${day}`;
      schedule[key] = formData.schedule[day].map(
        ({ hospital, startTime, endTime }) => ({
          hospitalName: hospital,
          timeSlot: `${startTime} - ${endTime}`,
        })
      );
    });

    const payload = {
      doctor: {
        username: formData.username,
        password: formData.password,
        name: formData.name,
        phoneNumber: formData.contactNumber,
        Specialization: formData.specialization,
        profilePicture: formData.profilePicture,
        doctorID: formData.doctorID,
      },
      schedule,
    };

    try {
      await registerDoctor(payload);
      alert("Doctor registered successfully!");
    } catch (error) {
      alert("Failed to register. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center overflow-hidden bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-7xl flex flex-col md:flex-row bg-white rounded-xl shadow-xl overflow-hidden"
      >
        {/* Left Panel */}
        <div className="w-full md:w-1/3 p-8 bg-white space-y-4">
          <h2 className="text-2xl text-yellow-500 font-bold mb-4 flex items-center gap-2">
            <UserCircle size={24} /> Doctor Profile
          </h2>

          {/* Profile Picture */}
          <div className="flex justify-center relative mb-2">
            <label htmlFor="profilePicture" className="cursor-pointer">
              {previewProfilePicture && (
                <img
                  src={previewProfilePicture}
                  alt="Profile"
                  className="w-50 h-50 border-4 rounded-full border-white shadow-md object-cover"
                />
              )}
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
              onChange={handleProfilePictureChange}
              accept="image/*"
            />
          </div>

          {/* Username */}
          <div className="relative">
            <User className="absolute top-2.5 left-3 text-gray-400" size={18} />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white"
            />
          </div>

          {/* Name */}
          <div className="relative">
            <UserCircle
              className="absolute top-2.5 left-3 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute top-2.5 left-3 text-gray-400" size={18} />
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
            <Lock className="absolute top-2.5 left-3 text-gray-400" size={18} />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className={`w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white ${
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword
                  ? "border border-red-500"
                  : ""
              }`}
            />
            {formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  Passwords do not match
                </p>
              )}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-0.5 bg-gray-300"></div>

        {/* Middle Panel */}
        <div className="w-full md:w-1/3 p-8 space-y-4 bg-white">
          <h2 className="text-2xl text-yellow-500 font-bold flex items-center gap-2">
            <BriefcaseMedical size={20} />
            Doctor Details
          </h2>

          {/* Doctor ID */}
          <div className="flex justify-center relative mb-2">
            <label htmlFor="doctorID" className="cursor-pointer">
              {previewDoctorID && (
                <img
                  src={previewDoctorID}
                  alt="Doctor ID"
                  className="w-90 h-50 object-cover rounded-md border shadow"
                />
              )}
            </label>
            <label
              htmlFor="doctorID"
              className="absolute bottom-1 right-[38%] bg-white p-2 rounded-full shadow-md cursor-pointer"
            >
              <Camera size={16} className="text-gray-600" />
            </label>
            <input
              type="file"
              id="doctorID"
              className="hidden"
              onChange={handleIDChange}
              accept="image/*"
            />
          </div>

          {/* Specialization */}
          <div className="relative">
            <BriefcaseMedical
              className="absolute top-2.5 left-3 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Specialization (e.g. Cardiologist)"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white"
            />
          </div>

          {/* Contact Number */}
          <div className="relative">
            <Phone
              className="absolute top-2.5 left-3 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Contact Number"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-0.5 bg-gray-300"></div>

        {/* Right Panel: Schedule */}
        <div className="w-full md:w-1/3 flex flex-col bg-white max-h-[90vh]">
          <div className="p-8 space-y-4 overflow-y-auto flex-1">
            <h2 className="text-2xl text-yellow-500 font-bold flex items-center gap-2">
              <CalendarClock size={20} />
              Weekly Schedule
            </h2>

            {daysOfWeek.map((day) => (
              <div key={day} className="mb-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  {day}
                </h3>

                {formData.schedule[day].map((entry, index) => (
                  <div
                    key={index}
                    className="border p-2 rounded-md shadow-sm bg-gray-100 space-y-2 relative mb-2"
                  >
                    <button
                      type="button"
                      onClick={() => removeTimeSlot(day, index)}
                      className="absolute -top-2 -right-2 text-red-500 text-lg"
                    >
                      ✖
                    </button>

                    <div className="flex items-center border rounded-sm overflow-hidden bg-gray-50">
                      <Hospital className="ml-2 text-gray-400" size={18} />
                      <select
                        value={entry.hospital}
                        onChange={(e) =>
                          handleScheduleChange(
                            day,
                            index,
                            "hospital",
                            e.target.value
                          )
                        }
                        className="w-full px-1 outline-none bg-transparent text-sm"
                      >
                        <option>Any Hospital</option>
                        {hospitals.map((h, idx) => (
                          <option key={idx} value={h.name || h}>
                            {h.name || h}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-1">
                      <input
                        type="time"
                        value={entry.startTime}
                        onChange={(e) =>
                          handleScheduleChange(
                            day,
                            index,
                            "startTime",
                            e.target.value
                          )
                        }
                        className="w-1/2 p-1 rounded border text-sm"
                      />
                      <input
                        type="time"
                        value={entry.endTime}
                        onChange={(e) =>
                          handleScheduleChange(
                            day,
                            index,
                            "endTime",
                            e.target.value
                          )
                        }
                        className="w-1/2 p-1 text-sm rounded border"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addTimeSlot(day)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  + Add Time Slot for {day}
                </button>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="p-4 border-t sticky bottom-0 bg-white z-10">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-white py-2 rounded shadow-md hover:brightness-110 transition"
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DoctorRegistration;
