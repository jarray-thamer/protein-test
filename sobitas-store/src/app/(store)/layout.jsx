"use client";
import Footer from "@/components/footer/footer";
import Header from "@/components/headers/header";
import BrandSection from "@/components/homePage/bandSection";
import Feature from "@/components/homePage/feature";
import Reviews from "@/components/homePage/reviews";

import { AuthProvider } from "@/context/authContext";

import useCartStore from "@/store/cart";
import useInformationStore from "@/store/information";
import { useEffect } from "react";

export default function RootLayout({ children }) {
  const { information } = useInformationStore();
  const initializeCart = useCartStore((state) => state.initializeCart);
  const initializeInformation = useInformationStore(
    (state) => state.initInformation
  );

  useEffect(() => {
    initializeCart(); // Load cart when app starts
    initializeInformation(); // Load information when app starts
  }, []);
  return (
    <AuthProvider>
      <Header information={information} />
      {children}
      <Reviews />
      <Feature />
      <BrandSection />
      <Footer information={information} />
    </AuthProvider>
  );
}
