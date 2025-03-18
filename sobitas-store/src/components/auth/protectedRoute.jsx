// components/ProtectedRoute.jsx
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading, checkAuth } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/auth/login");
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Will redirect in the useEffect
  }

  return children;
};

export default ProtectedRoute;
