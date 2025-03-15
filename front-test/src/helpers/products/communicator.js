import axios from "axios";
import { toast } from "sonner";

export const getAllProductsNormal = async () => {
  try {
    const res = await axios.get("/admin/product/get/all");

    return res.data;
  } catch (error) {
    throw new Error(error.res?.data?.message || "Failed to fetch products");
  }
};

export const deleteManyProducts = async (productIds) => {
  try {
    const res = await axios.post("/admin/product/delete/many", { productIds });
    toast.success("Product deleted successfully", {
      description: `Deleted ${res.data.data.deletedCount} products.`,
    });
    return res.data;
  } catch (error) {
    toast.error("Failed to delete products");
    throw new Error(error.res?.data?.message || "Failed to delete products");
  }
};

export const getProductById = async (productId) => {
  try {
    const res = await axios.get(`/admin/product/get/${productId}`);
    return res.data;
  } catch (error) {
    throw new Error(error.res?.data?.message || "Failed to fetch product");
  }
};

export const createProduct = async (formData) => {
  const response = await axios.post("/admin/product/new", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProduct = async (id, formData) => {
  const response = await axios.put(`/admin/product/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response?.data;
};
