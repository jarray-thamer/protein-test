"use client";


import ProtectedRoute from "@/components/auth/protectedRoute";
import { useAuth } from "@/context/authContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container py-10 mx-auto">
        <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
          <h2 className="mb-6 text-2xl font-bold">My Profile</h2>

          {user && (
            <div>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone1 || "Not provided"}
              </p>
              <p>
                <strong>City:</strong> {user.ville || "Not provided"}
              </p>
              <p>
                <strong>Address:</strong> {user.address || "Not provided"}
              </p>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full px-4 py-2 mt-6 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
