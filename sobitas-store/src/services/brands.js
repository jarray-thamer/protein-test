"use server";

import axiosInstance from "@/lib/axios";

export async function getBrands() {
  const res = await axiosInstance.get("/settings/homepage/get/all/brands");
  return res.data;
}
