import axios from "axios";
import Cookies from "js-cookie";

// Login the user
export const loginUser = async (data) => {
  try {
    const res = await axios.post("/admin/auth/admin/login", data);
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

// Check the authentication status of the user if the user is authenticated or not
export const checkAuthStatus = async (token) => {
  const res = await axios.get(`/admin/auth/admin/check-auth-status/${token}`);
  return res.data;
};

// logout the user
export const logoutUser = async () => {
  const res = await axios.get("/admin/auth/admin/logout");
  if (res.status !== 200) {
    console.log("Unable to logout");
  }

  const data = await res.data;
  window.location.reload();
  return data;
};
