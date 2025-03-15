import axios from "axios";

export const deleteSubcategory = async (id) => {
  try {
    const res = await axios.delete(`/admin/subcategory/delete/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete subcategory"
    );
  }
};

export const addSubCategory = async (data, categoryId) => {
  try {
    const designation = data.designation;
    const res = await axios.post(`/admin/subcategory/new`, {
      designation,
      categoryId,
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to add subcategory"
    );
  }
};

export const updateSubcategory = async (id, data) => {
  try {
    const designation = data.designation;
    const res = await axios.put(`/admin/subcategory/update/${id}`, {
      designation,
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update subcategory"
    );
  }
};

export const getSubCategoriesByCategory = async (id) => {
  try {
    const res = await axios.get(`/admin/subcategory/get/by-category/${id}`);

    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to get subcategories"
    );
  }
};
