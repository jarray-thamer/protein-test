"use server";

import axiosInstance from "@/lib/axios";

export async function getPackListPage(query) {
  const res = await axiosInstance.get(`/pack/get?${query}`);

  return res.data;
}

export async function getPackBySlug(slug) {
  const res = await axiosInstance.get(
    `/pack/get/store/packs/get-by-slug/${slug}`
  );
  return res.data;
}
