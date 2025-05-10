import { useEffect, useState } from "react";
import axios from "axios";
import { getAppointmentsByDoctor } from "./../services/appointmentAPI";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointmentsByDoctor(user.username);
        setAppointments(data);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userType === "doctor") {
      fetchAppointments();
    }
  }, [user]);

  if (loading)
    return <p className="p-4 text-center">Loading appointments...</p>;

  return (
    <div className="w-full mx-auto mt-10 p-16 bg-white rounded">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">My Appointments</h2>
      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments booked yet.</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Day</th>
              <th className="p-2">Time Slot</th>
              <th className="p-2">Hospital</th>
              <th className="p-2">Patient Username</th>
              <th className="p-2">Urgency</th>
              <th className="p-2">Booked At</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{appt.day}</td>
                <td className="p-2">{appt.timeSlot}</td>
                <td className="p-2">{appt.hospitalName}</td>
                <td className="p-2">{appt.details.patient_username}</td>
                <td className="p-2">{appt.details.urgency}</td>
                <td className="p-2">
                  {new Date(
                    parseInt(appt.details.booking_dateTime)
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DoctorDashboard;
