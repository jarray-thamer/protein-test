import axios from "axios";

export const getBlogs = async () => {
  try {
    const response = await axios.get("/admin/blogs/get/all");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to get blogs");
  }
};

export const createBlog = async (formData) => {
  try {
    const response = await axios.post("/admin/blogs/new", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to create blog");
  }
};

export const getBlogById = async (blogId) => {
  try {
    const response = await axios.get(`/admin/blogs/get/${blogId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to get blog by id"
    );
  }
};

export const updateBlog = async (blogId, formData) => {
  try {
    const response = await axios.put(
      `/admin/blogs/update/${blogId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to update blog");
  }
};

export const deleteBlog = async (blogId) => {
  try {
    const response = await axios.delete(`/admin/blogs/delete/${blogId}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to delete blog");
  }
};
