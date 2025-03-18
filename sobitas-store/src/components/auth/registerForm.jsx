"use client";

import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserIcon,
  MailIcon,
  LockIcon,
  PhoneIcon,
  MapPinIcon,
  HomeIcon,
  ArrowRightIcon,
} from "lucide-react";

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
      setFormError("Nom, email et mot de passe sont requis");
      return;
    }

    try {
      const res = await register(formData);
      console.log(res);

      if (res.status === "ok") {
        router.push("/"); // Redirect to home page or dashboard
      } else {
        setFormError(res.msg || "Échec de l'inscription");
      }
    } catch (err) {
      setFormError(err || "Une erreur s'est produite lors de l'inscription");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="max-w-xl">
          <h2 className="mb-4 text-2xl font-semibold tracking-wide text-black3">
            Créer un compte
          </h2>
          <p className="text-[#777] mb-6 font-light">
            Créez votre compte pour profiter de tous nos services et suivre vos
            commandes
          </p>

          {(formError || error) && (
            <div className="p-3 mb-6 text-red-700 bg-red-100 border border-red-200 rounded">
              {formError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777]">
                  <UserIcon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-12 py-3 border text-[#777] font-normal bg-[#fafafa] border-[#ebebeb] focus:outline-none focus:border-primary transition-colors"
                  placeholder="Nom complet *"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777]">
                  <MailIcon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-12 py-3 border text-[#777] font-normal bg-[#fafafa] border-[#ebebeb] focus:outline-none focus:border-primary transition-colors"
                  placeholder="Email *"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777]">
                  <LockIcon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-12 py-3 border text-[#777] font-normal bg-[#fafafa] border-[#ebebeb] focus:outline-none focus:border-primary transition-colors"
                  placeholder="Mot de passe *"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777]">
                  <PhoneIcon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <input
                  type="tel"
                  id="phone1"
                  name="phone1"
                  value={formData.phone1}
                  onChange={handleChange}
                  className="w-full px-12 py-3 border text-[#777] font-normal bg-[#fafafa] border-[#ebebeb] focus:outline-none focus:border-primary transition-colors"
                  placeholder="Téléphone"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777]">
                  <MapPinIcon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <input
                  type="text"
                  id="ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  className="w-full px-12 py-3 border text-[#777] font-normal bg-[#fafafa] border-[#ebebeb] focus:outline-none focus:border-primary transition-colors"
                  placeholder="Ville"
                  disabled={isLoading}
                />
              </div>

              <div className="relative md:col-span-2">
                <div className="absolute left-3 top-6 text-[#777]">
                  <HomeIcon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-12 py-3 border text-[#777] font-normal bg-[#fafafa] border-[#ebebeb] focus:outline-none focus:border-primary transition-colors"
                  placeholder="Adresse"
                  disabled={isLoading}
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 border-[#ebebeb] focus:ring-primary text-primary"
                required
              />
              <label htmlFor="terms" className="ml-2 text-[#777]">
                J'accepte les{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  conditions générales d'utilisation
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="uppercase w-full md:w-fit px-16 text-primary border border-primary flex items-center justify-center py-3 space-x-2.5 transition-all duration-300 ease-in hover:text-white hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-center">
                {isLoading ? "Inscription en cours..." : "Créer un compte"}
              </span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t md:border-t-0 md:border-l border-[#ebebeb] pt-8 md:pt-0 md:pl-8">
        <h3 className="mb-4 text-xl font-semibold tracking-wide text-black3">
          Déjà client?
        </h3>
        <p className="text-[#777] mb-6 font-light">
          Si vous avez déjà un compte, connectez-vous pour:
        </p>
        <ul className="space-y-2 text-[#777] mb-8">
          <li className="flex items-center">
            <span className="mr-2 text-primary">✓</span> Accéder à vos commandes
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-primary">✓</span> Consulter votre
            historique d'achats
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-primary">✓</span> Gérer vos informations
            personnelles
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-primary">✓</span> Bénéficier d'offres
            personnalisées
          </li>
        </ul>
        <Link
          href="/auth/login"
          className="uppercase w-full md:w-fit px-16 text-primary border border-primary flex items-center justify-center py-3 space-x-2.5 transition-all duration-300 ease-in hover:text-white hover:bg-primary"
        >
          <span>Se connecter</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
