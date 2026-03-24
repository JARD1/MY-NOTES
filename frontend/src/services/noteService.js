import axios from 'axios';

/**
 * Base URL for the Spring Boot Backend API.
 * This must match the port where your Java server is running.
 */
const API_URL = 'http://localhost:8080/api/notes';

/**
 * Service object containing all HTTP requests related to Notes.
 */
const noteService = {
  // GET: Fetch all active notes
  getActiveNotes: async () => {
    const response = await axios.get(`${API_URL}/active`);
    return response.data;
  },

  // GET: Fetch all archived notes
  getArchivedNotes: async () => {
    const response = await axios.get(`${API_URL}/archived`);
    return response.data;
  },

  // GET: Fetch notes filtered by a specific category (Phase 2)
  getNotesByCategory: async (categoryId) => {
    const response = await axios.get(`${API_URL}/category/${categoryId}`);
    return response.data;
  },

  // POST: Create a new note
  createNote: async (noteData) => {
    const response = await axios.post(API_URL, noteData);
    return response.data;
  },

  // PUT: Update an existing note
  updateNote: async (id, noteData) => {
    const response = await axios.put(`${API_URL}/${id}`, noteData);
    return response.data;
  },

  // DELETE: Delete a note by ID
  deleteNote: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },

  // PATCH: Toggle the archived status of a note
  toggleArchiveStatus: async (id) => {
    const response = await axios.patch(`${API_URL}/${id}/archive`);
    return response.data;
  }
};

export default noteService;