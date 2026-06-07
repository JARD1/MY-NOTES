import axios from 'axios';

/**
 * Base URL for the Spring Boot Backend API.
 * In production, VITE_API_URL should be 'https://my-notes-backend-otzz.onrender.com/api'
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// We append the specific endpoint for categories
const API_URL = `${API_BASE}/categories`;

/**
 * Service object containing HTTP requests related to Categories (Tags).
 * Essential for Phase 2 Requirement.
 */
const categoryService = {
  
  /**
   * Fetches all available categories from the database.
   * Useful for populating filter buttons and form selection lists.
   */
  getAllCategories: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  /**
   * Creates a new category.
   * @param {Object} categoryData - Must contain a 'name' property.
   */
  createCategory: async (categoryData) => {
    const response = await axios.post(API_URL, categoryData);
    return response.data;
  },

  /**
   * Deletes a category by its ID.
   */
  deleteCategory: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  }
};

export default categoryService;