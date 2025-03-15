"use server";

import axiosInstance from "@/lib/axios";

export async function getCategories() {
  try {
    const response = await axiosInstance.get("/category/get/all");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
}
