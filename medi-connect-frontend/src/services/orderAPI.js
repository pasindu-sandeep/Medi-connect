// src/services/orderAPI.js
import apiClient from "./apiClient";

export const placeOrder = async (orderData) => {
  try {
    const response = await apiClient.post("/order", orderData);
    return response.data;
  } catch (error) {
    console.error("Place order error:", error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const response = await apiClient.get("/orders");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw error;
  }
};
