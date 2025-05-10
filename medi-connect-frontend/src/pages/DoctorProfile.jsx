import { useEffect, useState } from "react";
import {
  getDoctorByUserName,
  deleteDoctorByUsername,
  updateDoctorProfile,
} from "./../services/doctorInfoAPI";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [editable, setEditable] = useState(false);
  const [newSlot, setNewSlot] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getDoctorByUserName(user.username);
        setDoctor(data.doctor);
        setSchedule({
          Monday: data.schedule.availabilityList_Monday || [],
          Tuesday: data.schedule.availabilityList_Tuesday || [],
          Wednesday: data.schedule.availabilityList_Wednesday || [],
          Thursday: data.schedule.availabilityList_Thurs || [],
          Friday: data.schedule.availabilityList_Friday || [],
          Saturday: data.schedule.availabilityList_Saturday || [],
          Sunday: data.schedule.availabilityList_Sunday || [],
        });
      } catch (err) {
        console.error("Failed to fetch doctor profile", err);
      }
    };

    fetchProfile();
  }, [user.username]);

  const handleSave = async () => {
    const formattedSchedule = {
      availabilityList_Monday: schedule.Monday,
      availabilityList_Tuesday: schedule.Tuesday,
      availabilityList_Wednesday: schedule.Wednesday,
      availabilityList_Thurs: schedule.Thursday,
      availabilityList_Friday: schedule.Friday,
      availabilityList_Saturday: schedule.Saturday,
      availabilityList_Sunday: schedule.Sunday,
    };

    try {
      await updateDoctorProfile(doctor, formattedSchedule);
      alert("Profile updated successfully.");
      setEditable(false);
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?"))
      return;

    try {
      await deleteDoctorByUsername(user.username);
      alert("Profile deleted.");
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleAddSlot = (day) => {
    const slot = newSlot[day];
    if (!slot?.hospitalName || !slot?.timeSlot) {
      alert("Please enter hospital and time.");
      return;
    }
    setSchedule((prev) => ({
      ...prev,
      [day]: [...prev[day], slot],
    }));
    setNewSlot((prev) => ({
      ...prev,
      [day]: { hospitalName: "", timeSlot: "" },
    }));
  };

  if (!doctor || !schedule)
    return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="max-w-4xl pt-10 mx-auto mt-10 bg-white p-6 rounded shadow space-y-6">
      <div className="flex flex-row">
        <h2 className="text-2xl font-bold text-blue-600">
          Doctor Profile:&nbsp;
        </h2>
        <h2 className="text-2xl font-bold text-black">{doctor.name}</h2>
      </div>

      <table className="mx-auto border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Profile Picture</th>
            <th className="px-4 py-2 text-left">Doctor ID</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2">
              <img
                src={
                  user.profilePicture.startsWith("data:image")
                    ? user.profilePicture
                    : `data:image/jpeg;base64,${user.profilePicture}`
                }
                alt="User"
                className="w-46 h-46 object-cover border-2 border-gray-400 rounded"
              />
            </td>
            <td className="px-4 py-2">
              <img
                src={
                  doctor.doctorID.startsWith("data:image")
                    ? doctor.doctorID
                    : `data:image/jpeg;base64,${doctor.doctorID}`
                }
                alt="Doctor ID"
                className="w-60 h-46 object-cover border-2 border-gray-400 rounded"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div>
        <label className="block font-semibold capitalize">Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          value={doctor.phoneNumber}
          className="w-full mt-1 p-2 border rounded bg-gray-100"
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block font-semibold capitalize">Specialization</label>
        <input
          type="text"
          name="Specialization"
          value={doctor.Specialization}
          className="w-full mt-1 p-2 border rounded bg-gray-100"
          onChange={handleChange}
        />
      </div>

      <h3 className="text-xl font-semibold text-gray-700 mt-6">
        Weekly Schedule
      </h3>
      {daysOfWeek.map((day) => (
        <div key={day} className="mb-4">
          <p className="font-bold">{day}</p>
          <ul className="ml-4 text-sm text-gray-700 space-y-1">
            {schedule[day]?.map((slot, idx) => (
              <li key={idx} className="flex justify-between">
                <span>
                  {slot.hospitalName} — {slot.timeSlot}
                </span>
                {editable && (
                  <button
                    className="text-red-500 text-xs"
                    onClick={() => {
                      const updated = [...schedule[day]];
                      updated.splice(idx, 1);
                      setSchedule((prev) => ({ ...prev, [day]: updated }));
                    }}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
          {editable && (
            <div className="flex gap-2 mt-2 ml-4">
              <input
                type="text"
                placeholder="Hospital"
                value={newSlot[day]?.hospitalName || ""}
                onChange={(e) =>
                  setNewSlot((prev) => ({
                    ...prev,
                    [day]: {
                      ...prev[day],
                      hospitalName: e.target.value,
                    },
                  }))
                }
                className="border p-1 rounded"
              />
              <input
                type="text"
                placeholder="Time (e.g. 09:00-11:00)"
                value={newSlot[day]?.timeSlot || ""}
                onChange={(e) =>
                  setNewSlot((prev) => ({
                    ...prev,
                    [day]: {
                      ...prev[day],
                      timeSlot: e.target.value,
                    },
                  }))
                }
                className="border p-1 rounded"
              />
              <button
                onClick={() => handleAddSlot(day)}
                className="bg-green-500 text-white px-2 rounded text-sm"
              >
                Add
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-4 flex-wrap mt-6">
        {editable ? (
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setEditable(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Edit Profile
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
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Profile
        </button>
      </div>
    </div>
  );
};

export default DoctorProfile;
