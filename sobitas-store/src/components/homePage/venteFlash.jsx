"use client";
import ProductCard from "../shared/productCard";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { getVenteFlashProductFeature } from "@/services/products";
import { motion } from "framer-motion";

const VenteFlash = () => {
  const { user } = useAuth();
  const [productsData, setProductsData] = useState([]);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getVenteFlashProductFeature();

        setProductsData(res.data || []);
      } catch (error) {
        console.error("Error fetching vente flash products:", error);
      }
    };
    fetchProduct(); // Call the fetchProduct function when the component mounts.
  }, []);

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
  return (
    <div className="w-full py-8 mx-auto mt-24 bg-gray-100">
      <div className="mx-auto max-w-screen-2xl">
        <motion.h3
          variants={fadeInVariants} // Apply the variants
          initial="hidden" // Initial state
          whileInView="visible" // Trigger animation when in view
          viewport={{ once: true, amount: 0.3 }} // Animate only once when 30% in view
          className="text-[34px] text-center text-black3 uppercase font-bold rubik"
        >
          Vente Flash
        </motion.h3>
        <motion.p
          variants={fadeFromLeftVariants} // Apply the variants
          initial="hidden" // Initial state
          whileInView="visible" // Trigger animation when in view
          viewport={{ once: true, amount: 0.3 }} // Animate only once when 30% in view
          className=" text-[16px] text-[#777777] text-center"
        >
          Des offres exclusives à durée limitée – ne les laissez pas passer !
        </motion.p>
        <div className="grid grid-cols-2 gap-4 px-4 mx-auto mt-12 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-8 max-w-screen-2xl">
          {productsData?.map((product, idx) => {
            return <ProductCard key={idx} user={user} product={product} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default VenteFlash;
