import axios from "axios";

// Get all categories
export const getAllCategories = async () => {
  try {
    // Make a GET request to fetch all categories
    const res = await axios.get("/admin/category/get/all");

    // Check if the response status is 200 (OK)
    if (res.status === 200) {
      // Return the data from the response
      return res.data; // Assuming the server returns { message: "Categories fetched successfully", data: categories }
    } else {
      // Handle unexpected status codes
      throw new Error(`Unexpected response status: ${res.status}`);
    }
  } catch (error) {
    // Handle errors
    if (error.response) {
      // The request was made, but the server responded with a non-2xx status code
      console.error(
        "Error fetching categories:",
        error.response.data.message || error.response.statusText
      );
      throw new Error(
        error.response.data.message || "Failed to fetch categories"
      );
    } else if (error.request) {
      // The request was made, but no response was received
      console.error("No response received:", error.request);
      throw new Error("No response received from the server");
    } else {
      // Something happened in setting up the request
      console.error("Error setting up request:", error.message);
      throw new Error("Failed to fetch categories");
    }
  }
};

export const deleteCategory = async ({ id }) => {
  try {
    const res = await axios.delete(`/admin/category/delete/${id}`);
    return res.data; // Return the response data for further handling
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete category"
    );
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post("/admin/category/new", categoryData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create category"
    );
  }
};

export const getCategoryById = async (categoryId) => {
  try {
    const res = await axios.get(`/admin/category/get/${categoryId}`);
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch category"
    );
  }
};

export const updateCategory = async (categoryId, categoryData) => {
  try {
    const res = await axios.put(
      `/admin/category/update/${categoryId}`,
      categoryData
    );
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update category"
    );
  }
};
