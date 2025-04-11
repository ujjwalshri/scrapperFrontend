import axios from 'axios';

const API_URL = 'http://localhost:5600/api/v1'; 

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

export const menuService = {
  /**
   * Create a new menu
   * @param {Object} menuData - The menu data
   * @returns {Promise<Object>} - The created menu
   */
  createMenu: async (menuData) => {
    try {
      const response = await api.post('/menus', menuData);
      return response.data;
    } catch (error) {
      console.error('Error creating menu:', error);
      throw error;
    }
  },

  /**
   * Add a new menu item
   * @param {string} menuId - The menu ID
   * @param {Object} itemData - The menu item data
   * @returns {Promise<Object>} - The updated menu with the new item
   */
  addMenuItem: async (menuId, itemData) => {
    try {
      const response = await api.post(`/menus/${menuId}/items`, itemData);
      return response.data;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  },
  
  /**
   * Get a menu by ID
   * @param {string} menuId - The menu ID
   * @returns {Promise<Object>} - The menu data
   */
  getMenu: async (menuId) => {
    try {
      const response = await api.get(`/menus/${menuId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching menu:', error);
      throw error;
    }
  },
  getAllMenusForUser: async () => {
    try {
      const response = await api.get('/menus');
      console.log(response);
      return response.data;
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  },
  deleteMenuItem: async (menuId, itemId) => {
    try {
      const response = await api.delete(`/menus/${menuId}/items/${itemId}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  },
  generateReport: async (menuId) => {
    try {
      const response = await api.post(`/analysis/menu/${menuId}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}; 
