"use client";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { InstagramFilled, YoutubeFilled } from "@ant-design/icons";
import Image from "next/image";
import axiosInstance from "@/lib/axios";

const Footer = ({ information }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axiosInstance.put("/clients/subscribe", {
        email,
      });

      if (!response.data.success) {
        throw new Error("Subscription failed");
      }

      setMessage("Subscription successful! Thank you!");
      setEmail("");
    } catch (error) {
      setMessage(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <footer className="text-white mt-2 bg-[#222]">
      <div className="mx-auto max-w-screen-2xl">
        <div className="py-8">
          <div className="container w-full px-4 mx-auto space-y-12">
            {/* subscribe */}
            <div className="mx-auto xl:w-1/2">
              <h1 className="font-bold uppercase ">Abonnez-vous</h1>
              <p className="text-primary">
                Rejoignez plus de 60000 abonnés et obtenez un nouveau coupon de
                réduction chaque mercredi.
              </p>
              {/* <div className="bg-[#000000] text-white p-6 rounded-lg flex flex-col md:flex-row justify-between items-center"> */}
              <form
                className="flex items-center w-full mt-4 overflow-hidden bg-white rounded-md"
                onSubmit={handleSubscribe}
                style={{ transform: "skewX(-20deg)" }}
              >
                <div
                  style={{ transform: "skewX(2deg)" }}
                  className="flex items-center w-full"
                >
                  <input
                    type="email"
                    placeholder="Votre adresse e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 text-black outline-none"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    className="bg-[#FF5000] text-white font-bold px-6 py-3 hover:bg-[#FF8000] transition-all disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "S'abonner"}
                  </button>
                </div>
              </form>

              {message && (
                <p
                  className={`mt-2 text-sm ${
                    message.includes("successful")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {message}
                </p>
              )}
              {/* </div> */}
            </div>
            {/*  */}
            <Separator className="mb-4 " />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px,1fr,1fr] space-y-10">
              {/* First Column: Brand / Description / Social */}
              <div className="w-fit">
                <Image
                  src="/logo.png"
                  width={120}
                  height={1080}
                  alt="footer logo"
                />
                <p className="mt-4 mb-4 text-sm leading-6">
                  PROTEINE TUNISIE - SOBITAS : Votre Partenaire Nutrition &
                  Équipement Sportif en Tunisie Experts depuis 2010 – Boostez
                  vos performances avec des compléments certifiés (protéines ,
                  créatine, BCAA, oméga3 ) et du matériel de musculation
                  professionnel ( équipements cardio fitness). Atteignez vos
                  objectifs prise de masse, force, ou récupération avec des
                  produits haute qualité, disponibles à Sousse et livrés en
                  Tunisie.
                  <br />
                  <div className="mt-2 ">
                    <span className="font-bold">Email:</span>{" "}
                    {information?.general?.contact?.email}
                    <br />
                    <span className="mt-2 font-bold">Adresse:</span>{" "}
                    {information?.general?.contact?.address}
                    <br />
                  </div>
                </p>
                <div className="flex flex-wrap gap-4 mt-6">
                  <a
                    href={information?.general?.social?.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className=""
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-facebook"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                  <a
                    href={information?.general?.social?.twitterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className=""
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 12 12"
                    >
                      <path
                        fill="#FFFFFF"
                        d="M.076 0H3.61l3.145 4.498L10.53 0h1.129L7.185 5.114L12 12H8.468L5.183 7.303L1.128 12H0l4.753-5.312z"
                      ></path>
                    </svg>
                  </a>
                  <a
                    href={information?.general?.social?.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className=""
                  >
                    <InstagramFilled className="text-[20px]" />
                  </a>
                  <a
                    href={information?.general?.social?.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className=""
                  >
                    <YoutubeFilled className="text-[20px]" />
                  </a>
                  <a
                    href={information?.general?.social?.linkedInUrl}
                    target="_blank"
                    rel="noreferrer"
                    className=""
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#FFFFFF"
                        d="M20.47 2H3.53a1.45 1.45 0 0 0-1.47 1.43v17.14A1.45 1.45 0 0 0 3.53 22h16.94a1.45 1.45 0 0 0 1.47-1.43V3.43A1.45 1.45 0 0 0 20.47 2M8.09 18.74h-3v-9h3ZM6.59 8.48a1.56 1.56 0 1 1 0-3.12a1.57 1.57 0 1 1 0 3.12m12.32 10.26h-3v-4.83c0-1.21-.43-2-1.52-2A1.65 1.65 0 0 0 12.85 13a2 2 0 0 0-.1.73v5h-3v-9h3V11a3 3 0 0 1 2.71-1.5c2 0 3.45 1.29 3.45 4.06Z"
                      ></path>
                    </svg>
                  </a>
                  <a
                    href={information?.general?.social?.pinterestUrl}
                    target="_blank"
                    rel="noreferrer"
                    className=""
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#FFFFFF"
                        d="M9.04 21.54c.96.29 1.93.46 2.96.46a10 10 0 0 0 10-10A10 10 0 0 0 12 2A10 10 0 0 0 2 12c0 4.25 2.67 7.9 6.44 9.34c-.09-.78-.18-2.07 0-2.96l1.15-4.94s-.29-.58-.29-1.5c0-1.38.86-2.41 1.84-2.41c.86 0 1.26.63 1.26 1.44c0 .86-.57 2.09-.86 3.27c-.17.98.52 1.84 1.52 1.84c1.78 0 3.16-1.9 3.16-4.58c0-2.4-1.72-4.04-4.19-4.04c-2.82 0-4.48 2.1-4.48 4.31c0 .86.28 1.73.74 2.3c.09.06.09.14.06.29l-.29 1.09c0 .17-.11.23-.28.11c-1.28-.56-2.02-2.38-2.02-3.85c0-3.16 2.24-6.03 6.56-6.03c3.44 0 6.12 2.47 6.12 5.75c0 3.44-2.13 6.2-5.18 6.2c-.97 0-1.92-.52-2.26-1.13l-.67 2.37c-.23.86-.86 2.01-1.29 2.7z"
                      ></path>
                    </svg>
                  </a>
                  <a
                    href={information?.general?.social?.whatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className=""
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#FFFFFF"
                        fillRule="evenodd"
                        d="M12 1.25c5.937 0 10.75 4.813 10.75 10.75S17.937 22.75 12 22.75c-1.86 0-3.61-.473-5.137-1.305l-4.74.795a.75.75 0 0 1-.865-.852l.8-5.29A10.7 10.7 0 0 1 1.25 12C1.25 6.063 6.063 1.25 12 1.25M7.943 6.7c-.735 0-1.344.62-1.23 1.386c.216 1.436.854 4.082 2.752 5.994c1.984 1.999 4.823 2.854 6.36 3.191c.796.175 1.475-.455 1.475-1.232v-1.824a.3.3 0 0 0-.192-.28l-1.96-.753a.3.3 0 0 0-.166-.014l-1.977.386c-1.275-.66-2.047-1.4-2.51-2.515l.372-2.015a.3.3 0 0 0-.014-.16l-.735-1.969a.3.3 0 0 0-.28-.195z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Second Column: Footer Links and Description */}
              <div>
                {/* Footer Links Container */}
                <div className="grid grid-cols-2 gap-4 ">
                  {/* Useful Links */}
                  <div className="w-fit">
                    <h3 className="mb-3 font-bold ">À propos de nous</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link
                          className="transition-all duration-300 ease-in hover:text-primary"
                          href="/pages/qui-somme-nous"
                        >
                          Qui somme-nous
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="transition-all duration-300 ease-in hover:text-primary"
                          href="/#nos-marques"
                        >
                          Nos marques
                        </Link>
                      </li>
                      <li>
                        <Link
                          target="_blank"
                          className="transition-all duration-300 ease-in hover:text-primary"
                          href="https://www.google.com/maps?ll=35.836358,10.629546&z=17&t=m&hl=fr&gl=TN&mapclient=embed&cid=5898273993463017996"
                        >
                          Site map
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="transition-all duration-300 ease-in hover:text-primary"
                          href="/contact-us"
                        >
                          Promotion
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="transition-all duration-300 ease-in hover:text-primary"
                          href="#"
                        >
                          Boutique
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* Customer Service */}
                  <div className=" w-fit">
                    <h3 className="mb-3 font-bold ">Commande et livraison</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link
                          className="transition-all duration-300 ease-in hover:text-primary"
                          href="#"
                        >
                          suivi de commande
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="transition-all duration-300 ease-in hover:text-primary"
                          href="#"
                        >
                          livraision
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="transition-all duration-300 ease-in hover:text-primary"
                          href="#"
                        >
                          méthodes de paiement
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* Services & Ventes */}
                  <div className="my-12 w-fit">
                    <h3 className="mb-3 font-bold ">Services & Ventes</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link
                          className="transition-all duration-300 ease-in hover:text-primary"
                          href="#"
                        >
                          Conditions générale de ventes
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="transition-all duration-300 ease-in hover:text-primary"
                          href="#"
                        >
                          Politique de rembousement
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="transition-all duration-300 ease-in hover:text-primary"
                          href="#"
                        >
                          Politique des cookies
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="transition-all duration-300 ease-in hover:text-primary"
                          href="#"
                        >
                          Qui somme nous
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* My Account */}
                  <div className="my-12 w-fit">
                    <h3 className="mb-3 font-bold ">Aide</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link
                          className="transition-all duration-300 ease-in hover:text-primary"
                          href="#"
                        >
                          support
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="transition-all duration-300 ease-in hover:text-primary"
                          href="#"
                        >
                          Confidentialité
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="transition-all duration-300 ease-in hover:text-primary"
                          href="#"
                        >
                          Programme de Fidélité
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Third Column: Map and App Links */}
              <div className="flex flex-col space-y-12 lg:flex-row lg:space-x-4">
                <div className="w-full rounded-lg">
                  <iframe
                    src={
                      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3200.2782693572457!2d10.628494814994378!3d35.836371480160744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1302131b30e891b1%3A0x51dae0f25849b20c!2sPROTEINE%20TUNISIE%20(%20PROTEIN%20SOUSSE%20-%20TUNISIE%3A%20Vente%20Proteine%20%C3%A0%20Sousse%2C%20Tunisie)%20SOBITAS!5e0!3m2!1sfr!2stn!4v1693395736857!5m2!1sfr!2stn"
                    }
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <div className="flex flex-col mt-4 space-y-2 lg:mt-0">
                  <Link href={"#"}>
                    <Image
                      src="/11.png"
                      width={210}
                      height={1080}
                      alt="app-store"
                    />
                  </Link>
                  <Link href={"#"}>
                    <Image
                      src="/22.png"
                      width={210}
                      height={1080}
                      alt="app-store"
                    />
                  </Link>
                  <Link href={"#"}>
                    <Image
                      src="/33.png"
                      width={210}
                      height={1080}
                      alt="app-gallery"
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Section: Copyright */}
            <div className="flex flex-col border-t border-t-[#cccccc]/50 items-center pt-6 mt-10 ">
              <p className="mb-4 text-sm text-center uppercase sm:text-left sm:mb-0">
                © {new Date().getFullYear()}
                <a href={"/#top"} className="mx-1 text-primary">
                  Proteine Tunisie
                </a>
              </p>
              <div className="flex flex-col items-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-6">
                <div className="flex items-center text-sm ">
                  Website Developed by
                  <a
                    className="ml-2 font-medium transition-colors duration-200 text-primary hover:underline"
                    href="https://www.linkedin.com/in/kais-safouene-3b7171188?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    K.M Solutions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
