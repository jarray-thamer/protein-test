import { checkAuthStatus, loginUser, logoutUser } from "@/helper/auth";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get("store-auth-token")
        const data = await checkAuthStatus(token);
        setUser(data.user);
        setIsLoggedIn(true);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (data) => {
    const res = await loginUser(data);
    if (res.status === "ok" && res.user) {
      Cookies.set("store-auth-token", res.user.token)
      setUser(res.user);
      setIsLoggedIn(true);
    }
    return res;
  };

  const logout = async () => {
    await logoutUser();
    setIsLoggedIn(false);
    setUser(null);
    Cookies.remove("store-auth-token");
    window.location.reload();
  };

  const value = { user, isLoggedIn, isLoading, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
