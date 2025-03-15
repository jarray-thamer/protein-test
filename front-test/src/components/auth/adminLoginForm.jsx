import { useAuth } from "@/context/authContext";
import React, { useState } from "react";

export const AdminLoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const res = await login(formData);

    // If successful, AuthContext will handle the state update and navigation
    if (res.status === "bad") {
      setError(res?.msg || "Login failed. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-start justify-center px-10 py-20 bg-white border-2 border-gray-100 rounded-xl"
    >
      <img src="logo.webp" className="w-44 " />
      <h4 className="text-2xl font-semibold text-zinc-900">Welcome Back</h4>
      <p className="mt-1.5 text-sm font-light text-zinc-500">
        Please enter the details to access sobitas admin panel.
      </p>

      <h5 className="mx-auto mt-4 text-red-600">{error}</h5>
      <div className="w-full mt-4">
        <div>
          <label htmlFor="username" className="text-lg font-medium">
            Username*
          </label>
          <input
            className="w-full p-4 mt-1 bg-transparent border-2 border-gray-100 rounded-xl"
            id="username"
            placeholder="e.g admin"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mt-4">
          <label className="text-lg font-medium" htmlFor="password">
            Password*
          </label>
          <input
            type="password"
            className="w-full p-4 mt-1 bg-transparent border-2 border-gray-100 rounded-xl"
            id="password"
            placeholder="e.g admin123"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="active:scale-[.98] hover:scale-[1.01] bg-opacity-90 active:bg-opacity-100 hover:bg-opacity-80 ease-in-out active:duration-75 transition-all w-full py-3 mt-8 text-lg font-bold text-white bg-[#ff4000] rounded-xl"
        >
          Check in
        </button>
      </div>
    </form>
  );
};
