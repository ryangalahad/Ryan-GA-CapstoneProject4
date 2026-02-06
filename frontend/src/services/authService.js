import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/register`,userData,
      );
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { success: false, error: "Registration failed" }
      );
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        password,
      });

      // Store tokens in localStorage
      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: "Login failed" };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Get access token
  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem("accessToken");
  },
};

export default authService;
