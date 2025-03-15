// In functions/products.js
import { deleteManyProducts } from "@/helpers/products/communicator";

export const handleDeleteManyProducts = async (productsArray, refresh) => {
  const productsIds = productsArray.map((product) => product.original._id);
  try {
    const res = await deleteManyProducts(productsIds);
    // After successful deletion, refresh the products list

    if (refresh) {
      refresh();
    }
    return res;
  } catch (error) {
    console.error("Error in handleDeleteManyProducts:", error);
    throw error;
  }
};
