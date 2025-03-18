"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/shared/productCard";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import {
  getMaterielDeMusculationProductFeature,
  getTopProductsFeature,
} from "@/services/products";
import Image from "next/image";
import Link from "next/link";

const Materiel = () => {
  const [productsData, setProductsData] = useState();
  const { user } = useAuth();

  // Enhanced Animation Variants
  const fadeInVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const fadeFromLeftVariants = {
    hidden: {
      opacity: 0,
      x: -30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getMaterielDeMusculationProductFeature();
        setProductsData(response.data || []);
      } catch (err) {
        console.error("Error fetching top products:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full mt-24">
      {/* Full-width hero section that extends beyond container */}
      <div className="relative w-screen h-[60vh] md:h-[70vh] overflow-hidden left-[50%] right-[50%] mx-[-50vw]">
        <Image
          src="/img/materiel.jpg"
          fill
          priority
          className="object-cover w-full"
          alt="Équipement de musculation et fitness"
        />

        {/* Enhanced Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40">
          <div className="absolute inset-0 flex flex-col items-start justify-center p-8 text-white max-w-8xl md:p-16 lg:p-24">
            <motion.h2
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="mb-4 text-3xl font-bold text-left uppercase md:text-5xl lg:text-7xl rubik"
            >
              Matériel de Musculation
            </motion.h2>
            <motion.p
              variants={fadeFromLeftVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="max-w-4xl mb-8 text-lg text-left text-gray-200 md:text-xl lg:text-2xl"
            >
              Découvrez notre gamme complète de matériel musculation, fitness et
              cardio pour équiper votre salle de sport. Atteignez vos objectifs
              avec des équipements de qualité professionnelle, adaptés à tous
              les niveaux. Performance, endurance et force, tout commence ici !
            </motion.p>
            <motion.div
              variants={buttonVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, amount: 0.5 }}
            >
              <Link
                href={`/products?category=${encodeURIComponent(
                  "EQUIPEMENTS ET ACCESSOIRES SPORTIFS"
                )}`}
              >
                <button
                  className="uppercase text-sm text-primary px-12 py-4 border-2 border-primary flex items-center justify-center space-x-2.5 transition-all duration-300 ease-in-out
                  hover:text-white hover:bg-primary hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                >
                  <span className="text-sm font-medium md:text-base">
                    Discover more
                  </span>
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <div />
      {/* Container for the rest of the content */}
      <div className="w-full mx-auto max-w-screen-2xl">
        <motion.div
          className="max-w-screen-xl px-4 mx-auto mt-16 mb-24 md:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h3
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-[34px] text-center text-black3 uppercase font-bold rubik mb-4"
          >
            Materiel de Musculation
          </motion.h3>
          <div className="grid grid-cols-2 gap-4 px-4 mx-auto mt-12 md:grid-cols-3 lg:grid-cols-4 md:gap-8 max-w-screen-2xl">
            {productsData?.map((product, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <ProductCard user={user} product={product} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Materiel;
