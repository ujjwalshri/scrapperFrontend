import axios from 'axios';

const API_URL = 'http://localhost:5600/api/v1'; // Update this to match your backend port

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a response interceptor to handle auth token
api.interceptors.response.use(
  (response) => {
    // If the response has a token in the header, store it
    const token = response.headers['authorization'];
    if (token) {
      localStorage.setItem('token', token);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a request interceptor to add the token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  signup: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      if (response.data.data.accessToken) {
        localStorage.setItem('token', response.data.data.accessToken);
      }
      return response.data;
    } catch (error) {
      // Pass through the error with description
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      // The token will be handled by the response interceptor
      console.log(response.data.data);
      if(response.data.data.accessToken){
        localStorage.setItem('token', response.data.data.accessToken);
      }
      return response.data;
    } catch (error) {
      // Pass through the error with description
      throw error;
    }
  },

  logout: async () => {
    try {
      // Call the backend logout endpoint to clear cookies
      await api.post('/users/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Always clear the local storage token
      localStorage.removeItem('token');
    }
  },

  getCurrentUser: () => {
    return localStorage.getItem('token');
  },
}; 