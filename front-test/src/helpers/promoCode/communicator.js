import axios from "axios";
import { toast } from "sonner";

export const getAllPromoCode = async () => {
  try {
    const response = await axios.get("/admin/promo-code/get/all");

    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.res?.data?.message || "Failed to get all Promo Code"
    );
  }
};

export const createPromoCode = async (data) => {
  const response = await axios.post("/admin/promo-code/new", data);

  return response?.data;
};

export const updatePromoCode = async (id, data) => {
  const response = await axios.put(`/admin/promo-code/update/${id}`, data);
  return response?.data;
};

export const getPromoCodeById = async (id) => {
  try {
    const response = await axios.get(`/admin/promo-code/get/${id}`);

    return response.data;
  } catch (error) {
    throw new Error(
      error?.res?.data?.message || "Failed to get Promo Code by ID"
    );
  }
};

export const deletePromoCode = async (promoCodeIds) => {
  try {
    const res = await axios.post("/admin/promo-code/delete/many", promoCodeIds);
    toast.success("PromoCode deleted successfully", {
      description: `Deleted ${res.data.data.deletedCount} PromoCode.`,
    });
    return res.data;
  } catch (error) {
    toast.error("Failed to delete packs");
    throw new Error(error.res?.data?.message || "Failed to delete packs");
  }
};
