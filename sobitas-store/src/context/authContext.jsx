import {
  checkAuthStatus,
  loginUser,
  logoutUser,
  registerUser,
} from "@/helper/auth";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAuthActions, useAuthStore } from "@/store/authStore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, isLoggedIn, isLoading } = useAuthStore();
  const { setUser, setIsLoggedIn, setIsLoading } = useAuthActions();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get("store-auth-token");
        const data = await checkAuthStatus(token);

        setUser(data.user);
        setIsLoggedIn(true);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [setUser, setIsLoggedIn, setIsLoading]);

  const login = async (email, password) => {
    const res = await loginUser(email, password);

    if (res.status === "ok" && res.user) {
      Cookies.set("store-auth-token", res.user.token);
      setUser(res.user);
      setIsLoggedIn(true);
    }
    return res;
  };

  const register = async (data) => {
    const res = await registerUser(data);

    if (res.user) {
      Cookies.set("store-auth-token", res.token);
      setUser(res.user);
      setIsLoggedIn(true);
    }
    if (res.status === "bad") {
      return res;
    }
  };

  const logout = async () => {
    await logoutUser();
    setIsLoggedIn(false);
    setUser(null);
    Cookies.remove("store-auth-token");
    window.location.reload();
  };

  const value = { user, isLoggedIn, isLoading, login, logout, register };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
