import apiClient from "./apiClient";

export const loginUser = async (username, password) => {
  try {
    const response = await apiClient.post("/login", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
