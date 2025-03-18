"use client";

import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MailIcon, LockIcon, ArrowRightIcon } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Email et mot de passe sont requis");
      return;
    }

    try {
      const res = await login(email, password);
      if (res.status === "ok") {
        router.push("/"); // Redirect to home page or dashboard
      } else {
        setFormError(res.message || "Échec de la connexion");
      }
    } catch (err) {
      setFormError(
        err.message || "Une erreur s'est produite lors de la connexion"
      );
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="max-w-xl">
          <h2 className="mb-4 text-2xl font-semibold tracking-wide text-black3">
            Connexion
          </h2>
          <p className="text-[#777] mb-6 font-light">
            Connectez-vous pour accéder à votre compte et gérer vos commandes
          </p>

          {(formError || error) && (
            <div className="p-3 mb-6 text-red-700 bg-red-100 border border-red-200 rounded">
              {formError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777]">
                <MailIcon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-12 py-3 border text-[#777] font-normal bg-[#fafafa] border-[#ebebeb] focus:outline-none focus:border-primary transition-colors"
                placeholder="Email *"
                disabled={isLoading}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777]">
                <LockIcon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-12 py-3 border text-[#777] font-normal bg-[#fafafa] border-[#ebebeb] focus:outline-none focus:border-primary transition-colors"
                placeholder="Mot de passe *"
                disabled={isLoading}
                required
              />
            </div>

            {/* <div className="flex items-center justify-between">
              <div className="flex items-center"></div>
              <Link
                href="/auth/forgot-password"
                className="text-[#777] hover:text-primary transition-colors"
              >
                Mot de passe oublié?
              </Link>
            </div> */}

            <button
              type="submit"
              disabled={isLoading}
              className="uppercase w-full md:w-fit px-16 text-primary border border-primary flex items-center justify-center py-3 space-x-2.5 transition-all duration-300 ease-in hover:text-white hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-center">
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t md:border-t-0 md:border-l border-[#ebebeb] pt-8 md:pt-0 md:pl-8">
        <h3 className="mb-4 text-xl font-semibold tracking-wide text-black3">
          Nouveau client?
        </h3>
        <p className="text-[#777] mb-6 font-light">
          Créez un compte pour profiter de nombreux avantages:
        </p>
        <ul className="space-y-2 text-[#777] mb-8">
          <li className="flex items-center">
            <span className="mr-2 text-primary">✓</span> Suivi de commandes
            facile
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-primary">✓</span> Sauvegarde de vos
            produits favoris
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-primary">✓</span> Promotions et offres
            exclusives
          </li>
        </ul>
        <Link
          href="/auth/register"
          className="uppercase w-full md:w-fit px-16 text-primary border border-primary flex items-center justify-center py-3 space-x-2.5 transition-all duration-300 ease-in hover:text-white hover:bg-primary"
        >
          <span>Créer un compte</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
