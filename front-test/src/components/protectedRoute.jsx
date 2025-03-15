import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/authContext";

export const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // TODO: build the loading component
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};
