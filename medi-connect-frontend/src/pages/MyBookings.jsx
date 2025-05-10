import { useEffect, useState } from "react";
import {
  getUserAppointments,
  deleteAppointment,
} from "./../services/appointmentAPI";

const MyBookings = () => {
  const [appointments, setAppointments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    const fetchAppointments = async () => {
      try {
        const data = await getUserAppointments(user.username);
        setAppointments(data);
      } catch {
        alert("Failed to load appointments");
      }
    };

    fetchAppointments();
  }, []);

  const handleDelete = async (appt) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this appointment?"
    );
    if (!confirmed) return;

    try {
      await deleteAppointment(appt);
      setAppointments((prev) => prev.filter((a) => a !== appt));
      alert("Appointment deleted");
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <div className="w-full mx-auto mt-10 pt-12 p-6 bg-white pl-20">
      <h2 className="text-2xl font-bold text-yellow-600 mb-4">My Bookings</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-500">You have no appointments.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt, idx) => (
            <div
              key={idx}
              className="border rounded p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>Doctor:</strong> {appt.doctorUsername}
                </p>
                <p>
                  <strong>Hospital:</strong> {appt.hospitalName}
                </p>
                <p>
                  <strong>Date:</strong> {appt.date}
                </p>
                <p>
                  <strong>Time:</strong> {appt.timeSlot}
                </p>
              </div>
              <button
                onClick={() => handleDelete(appt)}
                className="text-red-600 hover:underline"
              >
                ❌ Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
