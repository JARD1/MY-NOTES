import axios from 'axios';

/**
 * Base URL for the Spring Boot Backend Categories API.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/notes';

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