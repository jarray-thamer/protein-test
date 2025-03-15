"use client";

import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import useTopHeaderStore from "@/store/topHeader";

export default function TopHeader() {
  const { showTopHeader, toggleShowTopHeader } = useTopHeaderStore();

  // Animation variants for reuse
  const containerVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
  };

  return (
    <AnimatePresence>
      {showTopHeader && (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative w-full py-2.5"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{
              backgroundImage: `url("/topHeaderBackground.jpg")`,
            }}
          ></div>

          {/* Overlay with bg-primary */}
          <div className="absolute inset-0 bg-primary opacity-80"></div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-between w-full h-full">
            <div className="flex-grow text-center">
              <h4 className="text-white font-normal uppercase text-[13px] tracking-wide">
                Livraison gratuite à partir de 300 DT
              </h4>
            </div>
            <motion.div whileTap={{ scale: 0.95 }}>
              <XIcon
                onClick={() => toggleShowTopHeader(showTopHeader)}
                strokeWidth={1.5}
                color="white"
                size={18}
                className="flex-shrink-0 ml-auto mr-4 cursor-pointer"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
