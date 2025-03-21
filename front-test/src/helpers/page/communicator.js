import axios from "axios";

// Get all pages
export const getPages = async () => {
  try {
    const response = await axios.get(`/admin/pages/get/all`);

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get a single page by ID
export const getPageById = async (id) => {
  try {
    const response = await axios.get(`/admin/pages/get/by-id/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Create a new page
export const createPage = async (pageData) => {
  try {
    const response = await axios.post(`/admin/pages/new`, pageData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an existing page
export const updatePage = async (id, pageData) => {
  try {
    const response = await axios.put(`/admin/pages/edit/${id}`, pageData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a page
export const deletePage = async (id) => {
  try {
    const response = await axios.delete(`/admin/pages/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a single page by slug
export const getPageBySlug = async (slug) => {
  try {
    const response = await axios.get(`/admin/pages/get/by-slug/${slug}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
