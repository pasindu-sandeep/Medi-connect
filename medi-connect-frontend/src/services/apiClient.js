import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/medi-connect-backend/api/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    } else {
      console.error("API Error:", error.message);
    }
    return Promise.reject({
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
  }
);

export default apiClient;
