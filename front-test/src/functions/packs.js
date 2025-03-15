import { deleteManyPacks } from "@/helpers/packs/communicator";

export const handleDeleteManyPacks = async (packsArray, refresh) => {
  const packsIds = packsArray.map((pack) => pack.original._id);
  try {
    const res = await deleteManyPacks(packsIds);

    if (refresh) {
      refresh();
    }
    return res;
  } catch (error) {
    console.error("Error in handleDeleteManyPacks:", error);
    throw error;
  }
};
