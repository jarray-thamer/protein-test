import { deletePromoCode } from "@/helpers/promoCode/communicator";

export const handleDeleteManyPromoCodes = async (promoCodeArray, refresh) => {
  const promoCodeIds = promoCodeArray.map(
    (promoCode) => promoCode.original._id
  );
  try {
    const res = await deletePromoCode(promoCodeIds);
    if (refresh) {
      refresh();
    }
    return res;
  } catch (error) {
    console.error("Error in handleDeleteManyPromoCodes:", error);
    throw error;
  }
};
