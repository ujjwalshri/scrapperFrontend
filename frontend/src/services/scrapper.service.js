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

export const scrapperService = {
  /**
   * Search for restaurant data based on dish name and location
   * @param {Object} searchParams - The search parameters
   * @param {string} searchParams.dishName - The name of the dish to search for
   * @param {number} searchParams.latitude - The latitude coordinate
   * @param {number} searchParams.longitude - The longitude coordinate
   * @returns {Promise<Object>} - The restaurant data and stats
   */
  searchRestaurants: async (searchParams) => {
    try {
      const { dishName, latitude, longitude } = searchParams;
      
      if (!dishName || !latitude || !longitude) {
        throw new Error('Missing required parameters: dishName, latitude, and longitude');
      }
      
      console.log(`Searching for ${dishName} at coordinates: ${latitude}, ${longitude}`);
      
      // Use query parameters instead of a request body
      const response = await api.get(`/scrape?item=${encodeURIComponent(dishName)}&lat=${latitude}&long=${longitude}`);
      
      // Log the response to the console
      console.log('Restaurant data:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      throw error;
    }
  },
  
  /**
   * Get price recommendations based on the restaurant data
   * @param {string} dishName - The name of the dish
   * @returns {Promise<Object>} - Price recommendations data
   */
  getPriceRecommendations: async (dishName) => {
    try {
      if (!dishName) {
        throw new Error('Dish name is required');
      }
      
      const response = await api.get(`/scrape/recommendations?dish=${encodeURIComponent(dishName)}`);
      
      // Log the response to the console
      console.log('Price recommendations:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching price recommendations:', error);
      throw error;
    }
  }
};
