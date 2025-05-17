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
  }, [user]);

  const handleDelete = async (appt) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (!confirmed) return;

    try {
      // ✅ Ensure patientUsername is included
      await deleteAppointment({
        ...appt,
        patientUsername: user.username,
      });

      // ✅ Filter by values instead of object identity
      setAppointments((prev) =>
        prev.filter(
          (a) =>
            a.doctorUsername !== appt.doctorUsername ||
            a.date !== appt.date ||
            a.timeSlot !== appt.timeSlot
        )
      );

      alert("Appointment cancelled successfully");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete appointment");
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
