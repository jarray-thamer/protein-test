import axios from "axios";
import { toast } from "sonner";

export const getAllPacks = async () => {
  try {
    const response = await axios.get("/admin/pack/get/all");

    return response.data.data;
  } catch (error) {
    throw new Error(error.res?.data?.message || "Failed to fetch packs");
  }
};

export const getPackById = async (packId) => {
  try {
    const response = await axios.get(`/admin/pack/get/${packId}`);

    return response.data;
  } catch (error) {
    throw new Error(error.res?.data?.message || "Failed to fetch pack");
  }
};

export const createPack = async (formData) => {
  const response = await axios.post("/admin/pack/new", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response?.data;
};

export const deleteManyPacks = async (packsIds) => {
  try {
    const res = await axios.post("/admin/pack/delete/many", packsIds);
    toast.success("Packs deleted successfully", {
      description: `Deleted ${res.data.data.deletedCount} packs.`,
    });
    return res.data;
  } catch (error) {
    toast.error("Failed to delete packs");
    throw new Error(error.res?.data?.message || "Failed to delete packs");
  }
};

export const updatePack = async (packId, formData) => {
  const response = await axios.put(`/admin/pack/update/${packId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response?.data;
};
