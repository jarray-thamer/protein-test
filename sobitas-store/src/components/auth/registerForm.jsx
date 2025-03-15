// components/RegisterForm.jsx
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone1: "",
    ville: "",
    address: "",
  });
  const [formError, setFormError] = useState("");
  const { register, isLoading, error } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setFormError("Name, email and password are required");
      return;
    }

    try {
      const res = await register(formData);
      if (res.status === "ok") {
        router.push("/"); // Redirect to home page or dashboard
      } else {
        setFormError(res.message || "Registration failed");
      }
    } catch (err) {
      setFormError(err.message || "An error occurred during registration");
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center">Create an Account</h2>

      {(formError || error) && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">
          {formError || error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 text-gray-700">
            Full Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={isLoading}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-gray-700">
            Email*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={isLoading}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-gray-700">
            Password*
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={isLoading}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone1" className="block mb-2 text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone1"
            name="phone1"
            value={formData.phone1}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="ville" className="block mb-2 text-gray-700">
            City
          </label>
          <input
            type="text"
            id="ville"
            name="ville"
            value={formData.ville}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={isLoading}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="address" className="block mb-2 text-gray-700">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={isLoading}
            rows="3"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p>
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
