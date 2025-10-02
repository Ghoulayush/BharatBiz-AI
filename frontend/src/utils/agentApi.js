import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const agentApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Increase timeout to 60 seconds
  timeout: 60000,
  // Add CORS settings
  withCredentials: true,
  // Add retry settings
  retries: 3,
  retryDelay: 1000,
});

// Add token to requests
agentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
agentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.code === "ECONNABORTED") {
      throw new Error(
        "Request timed out. The server is taking too long to respond. Please try again."
      );
    }
    if (error.code === "ECONNREFUSED") {
      throw new Error(
        "Unable to connect to server. Please make sure the server is running."
      );
    }
    if (error.response) {
      throw new Error(error.response.data.detail || "Server error");
    }
    if (error.request) {
      throw new Error("No response from server");
    }
    throw error;
  }
);

export const sendMessage = async (message, chatHistory = []) => {
  try {
    console.log("Sending message to:", `${API_URL}/api/chat`);
    const response = await agentApi.post("/api/chat", {
      text: message,
      chat_history: chatHistory,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const checkStock = async (productId) => {
  try {
    const response = await agentApi.post("/api/chat", {
      text: `Check stock for ${productId}`,
      product_id: productId,
    });
    return response.data;
  } catch (error) {
    console.error("Error checking stock:", error);
    throw error;
  }
};
