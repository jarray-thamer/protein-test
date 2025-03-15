"use client";
import useInformationStore from "@/store/information";
import {
  CalendarDaysIcon,
  Clock3Icon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import axiosInstance from "@/lib/axios"; // Adjust the path as needed

const ContactPage = () => {
  const { information } = useInformationStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      setError(
        "Veuillez remplir les champs obligatoires : Nom, Email et Message"
      );
      setLoading(false);
      return;
    }

    try {
      // Using axiosInstance instead of fetch
      const response = await axiosInstance.post("/messages/new", formData);

      // Clear form on success
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setSuccess(true);
    } catch (err) {
      console.error("Erreur lors de l'envoi du formulaire :", err);
      setError(
        err.response?.data?.error ||
          "Échec de l'envoi du message. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto my-12 max-w-screen-2xl">
      {/* Rest of your component remains the same */}
      <div className="relative w-full">
        {/* Container for the background image */}
        <div className="relative w-full h-[300px]">
          <Image
            src="https://portotheme.com/html/molla/assets/images/blog/post-4.jpg"
            alt="Contact Us"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-full px-4 mx-auto max-w-screen-2xl">
            <h1 className="text-4xl font-semibold text-center text-white md:text-5xl">
              Contactez-nous
            </h1>
            <p className="text-lg text-center text-white md:text-xl">
              Restez en contact avec nous
            </p>
          </div>
        </div>
      </div>
      {/* Information and form section */}
      <div className="grid grid-cols-1 gap-4 mx-4 mt-12 md:grid-cols-2">
        {/* information */}
        <div className="flex flex-col">
          <h3 className="text-2xl font-semibold tracking-wide text-black3">
            Informations de contact
          </h3>
          <div className="grid grid-cols-1 gap-8 mt-6 md:grid-cols-2">
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-[auto_1fr] gap-2">
                <MapPinIcon strokeWidth={1} className="w-5 h-5 text-primary" />
                <span className="text-base text-[#666666]">
                  {information?.general?.contact?.address}
                </span>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-2">
                <PhoneIcon strokeWidth={1} className="w-5 h-5 text-primary" />
                <span className="text-base text-[#666666]">
                  {information?.general?.contact?.phone}
                </span>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-2">
                <PhoneIcon strokeWidth={1} className="w-5 h-5 text-primary" />
                <span className="text-base text-[#666666]">
                  {information?.general?.contact?.fax}
                </span>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-2">
                <MailIcon strokeWidth={1} className="w-5 h-5 text-primary" />
                <span className="text-base text-[#666666]">
                  {information?.general?.contact?.email}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Form */}
        <div className="flex flex-col">
          <h3 className="text-2xl font-semibold tracking-wide text-black3">
            Vous avez des questions ?
          </h3>
          <p className="text-[#777] mt-2 font-light">
            Utilisez le formulaire ci-dessous pour contacter l'équipe
            commerciale
          </p>

          {success && (
            <div className="p-3 mt-4 text-green-700 bg-green-100 border border-green-200 rounded">
              Merci ! Votre message a été envoyé avec succès.
            </div>
          )}

          {error && (
            <div className="p-3 mt-4 text-red-700 bg-red-100 border border-red-200 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                className="px-3 py-2 border text-[#777] font-normal bg-[#fafafa] border-[#ebebeb]"
                placeholder="Nom *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                className="px-3 py-2 border text-[#777] font-normal bg-[#fafafa] border-[#ebebeb]"
                placeholder="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
              <input
                className="px-3 py-2 border text-[#777] font-normal bg-[#fafafa] border-[#ebebeb]"
                placeholder="Téléphone *"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <input
                className="px-3 py-2 border text-[#777] font-normal bg-[#fafafa] border-[#ebebeb]"
                placeholder="Sujet *"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <textarea
              className="w-full px-3 mt-4 py-2 h-32 border text-[#777] font-normal bg-[#fafafa] border-[#ebebeb]"
              placeholder="Message *"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`mt-4 uppercase w-fit px-16 text-primary border border-primary group/cart flex items-center justify-center py-2 space-x-2.5 transition-all duration-300 ease-in hover:text-white hover:bg-primary ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <span className="text-center">
                {loading ? "Envoi en cours..." : "Envoyer"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
