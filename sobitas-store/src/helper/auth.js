"use server";
import axiosInstance from "@/lib/axios";

export const checkAuthStatus = async () => {
  const res = await axiosInstance.get("/auth/store/check-auth-status");

  return res.data;
};

// logout the user
export const logoutUser = async () => {
  const res = await axiosInstance.get("/auth/store/logout");
  if (res.status !== 200) {
    console.log("Unable to logout");
  }
  const data = await res.data;
  return data;
};

export const loginUser = async (email, password) => {
  const res = await axiosInstance.post("/auth/store/login", {
    email,
    password,
  });
  if (res.status !== 200) {
    throw new Error("Unable to login");
  }
  const data = await res.data;
  return data;
};
