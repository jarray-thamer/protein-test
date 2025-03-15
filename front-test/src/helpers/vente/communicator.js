import axios from "axios";
import { toast } from "sonner";

export const getVentes = async () => {
  try {
    const response = await axios.get("/admin/vente/get/all");

    return response.data;
  } catch (error) {
    throw new Error(error.res?.data?.message || "Failed to fetch ventes");
  }
};

export const updateVenteStatus = async (id, status) => {
  try {
    const res = await axios.put(`/admin/vente/update-status/${id}`, {
      status: status,
    });

    toast.success("Status updated successfully");
    return res.data;
  } catch (error) {
    throw new Error(
      error.res?.data?.message || "Failed to update Vente status"
    );
  }
};

export const getVenteById = async (id) => {
  try {
    const response = await axios.get(`/admin/vente/get/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.res?.data?.message || "Failed to fetch vente");
  }
};

export const deleteVente = async (id) => {
  try {
    const res = await axios.delete(`/admin/vente/delete/${id}`);
    toast.success("Vente deleted successfully");

    return res.data;
  } catch (error) {
    throw new Error(error.res?.data?.message || "Failed to delete vente");
  }
};

export const deleteManyVente = async (venteIds) => {
  try {
    const res = await axios.post("/admin/vente/delete/many", venteIds);
    toast.success("Ventes deleted successfully", {
      description: `Deleted ${res.data.data.deletedCount} Ventes.`,
    });
    return res.data;
  } catch (error) {
    toast.error("Failed to delete ventes");
    throw new Error(error.res?.data?.message || "Failed to delete ventes");
  }
};

export const createVente = async (vente) => {
  try {
    const res = await axios.post("/admin/vente/new", vente);
    toast.success("Vente created successfully");
    return res.data;
  } catch (error) {
    throw new Error(error.res?.data?.message || "Failed to create vente");
  }
};

export const updateVente = async (id, vente) => {
  try {
    const res = await axios.put(`/admin/vente/update/${id}`, vente);

    return res.data;
  } catch (error) {
    throw new Error(error.res?.data?.message || "Failed to update vente");
  }
};
