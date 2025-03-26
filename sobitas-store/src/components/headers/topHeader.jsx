"use client";

import { motion, AnimatePresence } from "framer-motion";
import useTopHeaderStore from "@/store/topHeader";
import { PhoneIcon } from "lucide-react";
import useInformationStore from "@/store/information";
import Link from "next/link";

export default function TopHeader() {
  const { showTopHeader, toggleShowTopHeader } = useTopHeaderStore();

  // Animation variants for reuse
  const containerVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
  };

  const { information } = useInformationStore();

  return (
    <AnimatePresence>
      {showTopHeader && (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full py-2.5 hidden md:relative md:flex"
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
          <div className="relative z-10 flex items-center w-full h-full justify-evenly">
            {/* <div className="flex-grow text-center"> */}
            <h4 className="text-white font-normal uppercase text-[13px] tracking-wide flex items-center">
              Contact: {information?.general?.contact?.phone} |{" "}
              {information?.general?.contact?.fax}
            </h4>
            <Link
              href={
                "https://www.google.com/maps?ll=35.836349,10.630565&z=16&t=m&hl=fr&gl=TN&mapclient=embed&cid=5898273993463017996"
              }
              className="text-white font-normal uppercase text-[13px] tracking-wide hover:underline"
            >
              {information?.general?.contact?.address}
            </Link>
            <h4 className="text-white font-normal uppercase text-[13px] tracking-wide">
              Livraison gratuite à partir de 300 DT
            </h4>

            {/* </div> */}

            {/* <motion.div whileTap={{ scale: 0.95 }}>
              <XIcon
                onClick={() => toggleShowTopHeader(showTopHeader)}
                strokeWidth={1.5}
                color="white"
                size={18}
                className="flex-shrink-0 ml-auto mr-4 cursor-pointer"
              />
            </motion.div> */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
