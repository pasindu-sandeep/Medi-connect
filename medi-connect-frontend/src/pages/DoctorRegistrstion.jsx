import { useState, useEffect } from "react";
import { Camera, Hospital } from "lucide-react";
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
    doctorID: "",
    specialization: "",
    contactNumber: "",
    profilePicture: "",
    schedule: initializeSchedule(),
  });

  const [previewProfilePicture, setPreviewImage] = useState("");
  const [previewDoctorID, setDoctorID] = useState("");

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

    // Convert schedule data
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

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // this includes base64 + mime
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div className="min-h-screen w-screen flex items-center justify-center overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col md:flex-row bg-white overflow-hidden"
      >
        {/* Doctor Info */}
        <div className="w-full md:w-1/2 p-8 bg-white space-y-4">
          <h2 className="text-2xl text-yellow-500 font-bold flex items-center gap-2 mb-4">
            <span className="bg-yellow-500 text-white p-1 rounded-full">+</span>
            Doctor Profile
          </h2>

          {/* Profile Picture */}
          <div className="flex justify-center relative mb-2">
            <label htmlFor="profilePicture" className="cursor-pointer">
              {previewProfilePicture && (
                <img
                  src={previewProfilePicture}
                  alt="Profile Preview"
                  className="w-80 h-50 border-4 rounded border-white shadow-md object-cover"
                />
              )}
            </label>
            <label
              htmlFor="profilePicture"
              className="absolute bottom-1 right-[38%] bg-white p-2 rounded-full shadow-md cursor-pointer"
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

          {/* Doctor Details */}
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
              placeholder="User Name"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>

          {/* profile name */}
          <div className="relative">
            <Hospital
              className="absolute top-2.5 left-3 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Profile Name"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Hospital
              className="absolute top-2.5 left-3 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-0.5 bg-gray-300"></div>

        {/* Doctor Info */}
        <div className="w-full md:w-1/2 p-8 bg-white space-y-4">
          <h2 className="text-2xl text-yellow-500 font-bold flex items-center gap-2 mb-4">
            <span className="bg-yellow-500 text-white p-1 rounded-full">+</span>
            Details of the Doctor
          </h2>

          {/* Doctor ID */}
          <div className="flex justify-center relative mb-2">
            <label htmlFor="doctorID" className="cursor-pointer">
              {previewDoctorID && (
                <img
                  src={previewDoctorID}
                  alt="Doctor ID"
                  className="w-80 h-50 border-4 border-white shadow-md object-cover"
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
            <Hospital
              className="absolute top-2.5 left-3 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Specialization (e.g. Cardiologist)"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
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
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Contact Number"
              className="w-full pl-10 pr-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-0.5 bg-gray-300"></div>

        {/* Weekly Schedule */}
        <div className="w-full md:w-1/2 p-8 bg-white space-y-4 overflow-y-auto max-h-[90vh]">
          <h2 className="text-2xl text-yellow-500 font-bold flex items-center gap-2">
            <span className="bg-yellow-500 text-white p-1 rounded-full">
              📅
            </span>
            Weekly Schedule
          </h2>

          {daysOfWeek.map((day) => (
            <div key={day} className="mb-6">
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

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-400 text-white py-2 rounded shadow-md hover:brightness-110 transition"
          >
            Submit Registration
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorRegistration;
