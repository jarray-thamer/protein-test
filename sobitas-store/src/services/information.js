"use server";

import axiosInstance from "@/lib/axios";

export async function getInformation() {
  const res = await axiosInstance.get("/settings/get/information");
  return res.data;
}

export async function getSlides() {
  try {
    const res = await axiosInstance.get("/settings/homepage/get/all/slides");
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
