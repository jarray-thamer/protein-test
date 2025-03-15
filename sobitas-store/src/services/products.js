"use server";
import axiosInstance from "@/lib/axios";

export async function getTopProductsFeature() {
  const response = await axiosInstance.get("/product/get/store/products/top");

  return response.data;
}

export async function getNewProductsFeature() {
  const response = await axiosInstance.get("/product/get/store/products/new");

  return response.data;
}

export async function getVenteFlashProductFeature() {
  const response = await axiosInstance.get(
    "/product/get/store/products/vente-flash"
  );
  return response.data;
}

export async function getMaterielDeMusculationProductFeature() {
  const response = await axiosInstance.get(
    "/product/get/store/products/materiel-de-musculation"
  );
  return response.data;
}

export async function getProductBySlug(slug) {
  const response = await axiosInstance.get(
    `/product/get/store/products/get-by-slug/${slug}`
  );

  return response.data;
}

export async function getProductListPage(data) {
  const res = await axiosInstance.get(`/product/get?${data}`);
  return res.data;
}

export async function getMaxPrice() {
  const response = await axiosInstance.get("/product/get-max-price");
  return response.data;
}

export async function getRelatedProducts(productCategory) {
  const response = await axiosInstance.get(`/product/get${productCategory}`);
  return response.data;
}
