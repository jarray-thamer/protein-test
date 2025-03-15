"use server";
import axiosInstance from "@/lib/axios";

export const checkAuthStatus = async (token) => {
  const res = await axiosInstance.get(`/auth/store/check-auth-status/${token}`);

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
    const res = await axios.post("/auth/store/login", {email, password});
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
