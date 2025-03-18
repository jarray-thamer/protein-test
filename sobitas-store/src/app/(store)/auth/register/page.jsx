"use client";

import RegisterForm from "@/components/auth/registerForm";
import { useAuth } from "@/context/authContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterPage() {
  const auth = useAuth();
  const navigate = useRouter();

  useEffect(() => {
    if (auth?.user) {
      navigate.push("/");
    }
  }, [auth?.user, navigate]);
  return (
    <div className="flex flex-col w-full my-12">
      {/* Hero Section */}
      <div className="relative w-full">
        {/* Background image */}
        <div className="relative w-full h-[300px]">
          <Image
            src="https://portotheme.com/html/molla/assets/images/blog/post-4.jpg"
            alt="Register"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-full px-4 mx-auto max-w-screen-2xl">
            <h1 className="text-4xl font-semibold text-center text-white md:text-5xl">
              Créer un compte
            </h1>
            <p className="text-lg text-center text-white md:text-xl">
              Rejoignez-nous et profitez de tous nos services
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full px-12 mx-auto my-12 max-w-screen-2xl">
        <RegisterForm />
      </div>
    </div>
  );
}
