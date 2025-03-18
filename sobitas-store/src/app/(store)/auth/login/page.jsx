"use client";

import LoginForm from "@/components/auth/loginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex flex-col w-full my-12">
      {/* Hero Section */}
      <div className="relative w-full">
        {/* Background image */}
        <div className="relative w-full h-[300px]">
          <Image
            src="https://portotheme.com/html/molla/assets/images/blog/post-4.jpg"
            alt="Login"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-full px-4 mx-auto max-w-screen-2xl">
            <h1 className="text-4xl font-semibold text-center text-white md:text-5xl">
              Connexion
            </h1>
            <p className="text-lg text-center text-white md:text-xl">
              Accédez à votre compte
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full px-4 mx-auto my-12 max-w-screen-2xl">
        <LoginForm />
      </div>
    </div>
  );
}
