import apiClient from "./apiClient";

export const getDoctorList = async () => {
  try {
    const response = await apiClient.get("/doctors/names");
    console.log("Doctor list response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor list:", error);
    throw error;
  }
};

export const getDoctorsWithDetails = async () => {
  try {
    const response = await apiClient.get("/doctors-details");
    console.log("Doctor list response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor list:", error);
    throw error;
  }
};

export const getDoctorByName = async (doctorName) => {
  try {
    const response = await apiClient.get("/doctor-by-name", {
      params: { name: doctorName },
    });
    console.log("Doctor by name response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor by name:", error);
    throw error;
  }
};

export const getDoctorByUserName = async (doctorUserName) => {
  try {
    const response = await apiClient.get("/doctor-profile/data", {
      params: { username: doctorUserName },
    });
    console.log("Doctor by name response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor by name:", error);
    throw error;
  }
};

export const deleteDoctorByUsername = async (doctorUserName) => {
  try {
    const response = await apiClient.delete("/doctor-profile/delete", {
      params: { username: doctorUserName },
    });
    console.log("Doctor delete response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting doctor profile:", error);
    throw error;
  }
};

export const getDoctorsByHospitalsAnsSpecialization = async (
  Hospital,
  specialization
) => {
  try {
    const response = await apiClient.get("/doctors/filter", {
      params: { hospital: Hospital, specialization: specialization },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// services/doctorInfoAPI.js
export const updateDoctorProfile = async (doctor, schedule) => {
  try {
    const response = await apiClient.put("/doctor-profile/update", {
      doctor,
      schedule,
    });
    console.log("Profile update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    throw error;
  }
};

export const registerDoctor = async (payload) => {
  try {
    const response = await apiClient.post("/doctor-register", payload);
    return response.data;
  } catch (error) {
    console.error("Error registering doctor:", error);
    throw error;
  }
};
