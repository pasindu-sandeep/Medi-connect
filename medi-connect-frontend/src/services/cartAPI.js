// services/cartService.js
import apiClient from "./apiClient"; // your axios instance

// Add or update a single item in the cart
export const addToCart = async (product) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const payload = {
    username: user.username,
    item: {
      sku: product.sku,
      name: product.name,
      qty: 1,
      price: product.price,
      image: product.image,
    },
  };

  try {
    const response = await apiClient.post("/cart", payload);
    console.log("Item added to cart:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

// Get the user's entire cart
export const getCart = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await apiClient.get(`/cart`, {
      params: { username: user.username },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

// Delete a specific item from the cart
export const deleteCartItem = async (sku) => {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await apiClient.delete(`/cart`, {
      params: {
        username: user.username,
        sku: sku,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    throw error;
  }
};
