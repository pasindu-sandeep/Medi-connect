import React, { useEffect, useState } from "react";
import { getDoctorAppointments } from "../services/appointmentAPI";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    const fetchAppointments = async () => {
      try {
        const data = await getDoctorAppointments(user.username);
        setAppointments(data);
      } catch (error) {
        alert("Failed to load doctor appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  if (loading) return <p>Loading appointments...</p>;

  if (appointments.length === 0) {
    return <p>No appointments found.</p>;
  }

  return (
    <div>
      <h2>Doctor Appointments</h2>
      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Appointment Date</th>
            <th>Time</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt, idx) => (
            <tr key={idx}>
              <td>{appt.patientName || "N/A"}</td>
              <td>{appt.date}</td>
              <td>{appt.time}</td>
              <td>{appt.reason || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorAppointments;
