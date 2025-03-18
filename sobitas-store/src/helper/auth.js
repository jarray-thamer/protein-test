"use server";
import axiosInstance from "@/lib/axios";

export const checkAuthStatus = async (token) => {
  const res = await axiosInstance.get(`/auth/store/check-auth-status/${token}`);
  console.log(token);

  console.log(res);

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
  try {
    const res = await axiosInstance.post("/auth/store/login", {
      email,
      password,
    });
    console.log(res);

    return { status: "ok", user: res.data }; // Return the response data on success
  } catch (error) {
    if (error.response.data.message) {
      return { status: "bad", msg: error?.response?.data?.message };
    }
    if (error.response.data.errors[0]) {
      return { status: "bad", msg: error?.response?.data?.errors[0] };
    }
    return;
  }
};

export const registerUser = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/store/register", {
      name: data.name,
      email: data.email,
      password: data.password,
      phone1: data.phone1,
      ville: data.ville,
      address: data.address,
    });

    return res; // Return the response data on success
  } catch (error) {
    if (error.response.data.message) {
      return { status: "bad", msg: error?.response?.data?.message };
    }
    if (error.response.data.errors[0]) {
      return { status: "bad", msg: error?.response?.data?.errors[0] };
    }
    return;
  }
};
