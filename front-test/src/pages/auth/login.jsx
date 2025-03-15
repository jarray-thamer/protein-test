import { AdminLoginForm } from "@/components/auth/adminLoginForm";
import { useAuth } from "@/context/authContext";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  useEffect(() => {
    if (auth?.user) {
      return navigate("/dashboard");
    }
  }, [auth]);
  return (
    <div className="flex w-full h-screen p-4 bg-[#f1f1f1]">
      <div className="flex items-center justify-center w-full lg:w-1/2">
        <AdminLoginForm />
      </div>
      <div className="items-center justify-center hidden h-full bg-gray-200 rounded-xl lg:w-1/2 lg:flex">
        <img src="login.png" className="object-contain h-full" />
      </div>
    </div>
  );
};
