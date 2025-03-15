"use client";

import { motion } from "framer-motion";

import ProductCard from "@/components/shared/productCard";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { getNewProductsFeature } from "@/services/products";

const NewProducts = () => {
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
        const response = await getNewProductsFeature();

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
        Nouveaux Produits
      </motion.h3>
      <motion.p
        variants={fadeFromLeftVariants} // Apply the variants
        initial="hidden" // Initial state
        whileInView="visible" // Trigger animation when in view
        viewport={{ once: true, amount: 0.3 }} // Animate only once when 30% in view
        className=" text-[16px] text-[#777777] text-center"
      >
        Découvrez les toutes dernières tendances et nouveautés des plus grandes
        marques !
      </motion.p>
      <div className="flex flex-wrap items-center justify-center w-full gap-8 px-2 mx-auto mt-12 max-w-screen-2xl">
        {productsData?.map((product, idx) => {
          return <ProductCard key={idx} user={user} product={product} />;
        })}
      </div>
    </div>
  );
};

export default NewProducts;
