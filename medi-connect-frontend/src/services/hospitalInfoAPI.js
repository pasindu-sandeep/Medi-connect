import apiClient from "./apiClient";

export const getHospitalList = async () => {
  try {
    const response = await apiClient.get("/hospitals");
    return response.data;
  } catch (error) {
    console.error("Error fetching hospital list:", error);
    throw error;
  }
};

export const getHospitalsWithDetails = async () => {
  try {
    const response = await apiClient.get("/hospital-details");
    return response.data;
  } catch (error) {
    console.error("Error fetching hospital detail list:", error);
    throw error;
  }
};

export const registerHospital = async (payload) => {
  try {
    const response = await apiClient.post("/hospital-register", payload);
    return response.data;
  } catch (error) {
    console.error("Error registering hospital:", error);
    throw error;
  }
};

export const deleteHospital = async (hospitalName) => {
  try {
    const response = await apiClient.delete("/hospital-delete", {
      params: { name: hospitalName },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting hospital:", error);
    throw error;
  }
};
