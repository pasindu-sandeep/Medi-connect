import apiClient from "./apiClient";

// Get user appointments
export const getUserAppointments = async (username) => {
  try {
    const response = await apiClient.get(`/appointments/user/${username}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    throw error;
  }
};

// Delete an appointment
export const deleteAppointment = async (appointment) => {
  try {
    await apiClient.delete("/appointments/delete", {
      data: appointment,
    });
  } catch (error) {
    console.error("Failed to delete appointment:", error);
    throw error;
  }
};

export const getDoctorAppointments = async (doctorUsername) => {
  try {
    const response = await apiClient.get(
      `/appointments/doctor/${doctorUsername}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    throw error;
  }
};

export const getAppointmentsByDoctor = async (username) => {
  try {
    const response = await apiClient.get("/appointments/doctor", {
      params: { username },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor's appointments:", error);
    throw error;
  }
};

export const getAll = async () => {
  try {
    const response = await apiClient.get("/appointments/all");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAppointmentCountByDoctor = async () => {
  try {
    const response = await apiClient.get("/appointments/doctor-count");
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor appointment counts:", error);
    throw error;
  }
};

// Fetch total system statistics: doctors, patients, hospitals, appointments
export const getSystemStats = async () => {
  try {
    const response = await apiClient.get("/system/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching system stats:", error);
    throw error;
  }
};

export const bookAppointment = async ({
  doctorUsername,
  patientUsername,
  hospitalName,
  date,
  timeSlot,
  urgency,
}) => {
  try {
    const response = await apiClient.post("/appointments/book", {
      doctorUsername,
      patientUsername,
      hospitalName,
      date,
      timeSlot,
      urgency,
    });

    return response.data;
  } catch (error) {
    // Optional: unwrap error message from server
    const message =
      error.response?.data?.error || "Failed to book appointment.";
    throw new Error(message);
  }
};
