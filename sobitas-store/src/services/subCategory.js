"use server";

import axiosInstance from "@/lib/axios";

export async function getSubCategories() {
  try {
    const response = await axiosInstance.get("/subcategory/get/all");
    return response.data.data;
  } catch (error) {}
}
