import { checkAuthStatus, logoutUser } from "@/helper/auth";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await checkAuthStatus();
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
      setUser(res.user);
      setIsLoggedIn(true);
    }
    return res;
  };

  const logout = async () => {
    await logoutUser();
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

  const value = { user, isLoggedIn, isLoading, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
