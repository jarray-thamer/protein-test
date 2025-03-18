"use client";

import { motion } from "framer-motion";

import ProductCard from "@/components/shared/productCard";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { getTopProductsFeature } from "@/services/products";

const MilleurVente = () => {
  const [productsData, setProductsData] = useState();
  const { user } = useAuth();
  // Animation Variants
  const fadeInVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8, // Animation duration
        ease: "easeOut", // Easing function
      },
    },
  };
  const fadeFromLeftVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getTopProductsFeature();

        setProductsData(response.data || []);
      } catch (err) {
        console.error("Error fetching top products:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full mx-auto mt-24 max-w-screen-2xl">
      <motion.h3
        variants={fadeInVariants} // Apply the variants
        initial="hidden" // Initial state
        whileInView="visible" // Trigger animation when in view
        viewport={{ once: true, amount: 0.3 }} // Animate only once when 30% in view
        className="text-[34px] text-center text-black3 uppercase font-bold rubik"
      >
        Meilleures Ventes
      </motion.h3>
      <motion.p
        variants={fadeFromLeftVariants} // Apply the variants
        initial="hidden" // Initial state
        whileInView="visible" // Trigger animation when in view
        viewport={{ once: true, amount: 0.3 }} // Animate only once when 30% in view
        className=" text-[16px] text-[#777777] text-center"
      >
        Découvrez les produits les plus populaires et les plus appréciés par nos
        clients !
      </motion.p>
      <div className="grid grid-cols-2 gap-4 px-4 mx-auto mt-12 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-8 max-w-screen-2xl">
        {productsData?.map((product, idx) => {
          return <ProductCard key={idx} user={user} product={product} />;
        })}
      </div>
    </div>
  );
};

export default MilleurVente;
