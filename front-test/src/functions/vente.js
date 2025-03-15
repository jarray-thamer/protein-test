import {
  deleteManyVente,
  updateVenteStatus,
} from "@/helpers/vente/communicator";

export const updateStatus = async (id, statusString, refresh) => {
  try {
    const res = await updateVenteStatus(id, statusString);
    if (refresh) {
      refresh();
    }
    return res;
  } catch (error) {
    console.error("Error in edit Vente status:", error);
    throw error;
  }
};

export const handleDeleteManyVentes = async (venteArray, refresh) => {
  const ventesIds = venteArray.map((vente) => vente?.original?._id || vente);

  try {
    const res = await deleteManyVente(ventesIds);
    if (refresh) {
      refresh();
    }
    return res;
  } catch (error) {
    console.error("Error in delete many Ventes:", error);
    throw error;
  }
};
