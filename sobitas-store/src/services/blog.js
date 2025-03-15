"use server";
import axiosInstance from "@/lib/axios";

export async function getLandingPageBlogs() {
  const response = await axiosInstance("/blogs/get-all-landing-page");

  return response.data;
}

export async function getBlogBySlug(slug) {
  const response = await axiosInstance(`/blogs/get/by-slug/${slug}`);

  return response.data;
}

export async function getAllBlogs() {
  const response = await axiosInstance("/blogs/get/all");
  return response.data;
}
