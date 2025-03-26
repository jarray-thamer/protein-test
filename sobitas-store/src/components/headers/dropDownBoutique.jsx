"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCategories } from "@/services/category";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

const BoutiqueDropdown = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await getCategories();
        setCategories(res);
        // Remove this line to prevent auto-selecting the first category
        // if (res.length > 0) {
        //   setActiveCategory(res[0]);
        // }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Helper function to create URL-friendly slug
  const createUrlSlug = (text) => {
    return encodeURIComponent(text);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -5,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="absolute bg-white rounded-b-lg shadow-xl -left-32 w-fit top-full"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={dropdownVariants}
    >
      <div className="flex px-6 py-8 mx-auto max-w-screen-2xl">
        {/* Category List */}
        <div className="w-64 pr-6 border-r border-gray-200">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-8 bg-gray-100 rounded-md animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            categories.map((category) => (
              <motion.div
                key={category.id}
                onMouseEnter={() => setActiveCategory(category)}
                className={`py-3 px-4 cursor-pointer rounded-md transition-all duration-200 hover:bg-gray-50 hover:text-primary ${
                  activeCategory?.id === category.id
                    ? "bg-gray-50 font-medium"
                    : "text-gray-700"
                }`}
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center justify-between">
                  <span>{category.designation}</span>
                  <ChevronRight
                    size={16}
                    className={`transition-transform duration-200 ${
                      activeCategory?.id === category.id
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Enhanced Subcategories */}
        <div className="grid w-[600px] grid-cols-3 gap-6 pl-8">
          <AnimatePresence mode="wait">
            {activeCategory ? (
              <motion.div
                key={activeCategory.id}
                className="grid grid-cols-3 col-span-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeCategory.subCategories?.map((subcategory) => (
                  <motion.div
                    key={subcategory.id}
                    variants={itemVariants}
                    className="p-3 transition-colors duration-200 rounded-lg hover:bg-gray-50"
                  >
                    <Link
                      href={`/products?category=${createUrlSlug(
                        activeCategory.designation
                      )}&subcategory=${createUrlSlug(subcategory.designation)}`}
                      className="block mb-3 font-medium text-gray-800 transition-colors duration-200 hover:text-primary"
                    >
                      <span className="relative inline-block">
                        {subcategory.designation}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </Link>
                    <div className="space-y-2.5 pl-2 border-l-2 border-gray-100">
                      {subcategory.children?.map((child) => (
                        <Link
                          key={child.id}
                          href={`/products?category=${createUrlSlug(
                            activeCategory.designation
                          )}&subcategory=${createUrlSlug(
                            subcategory.designation
                          )}&childCategory=${createUrlSlug(child.designation)}`}
                          className="block text-sm text-gray-600 transition-colors duration-200 hover:text-primary hover:translate-x-1"
                        >
                          {child.designation}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center justify-center w-full h-full col-span-3 py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-gray-500">
                  Survolez une catégorie pour voir les sous-catégories.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default BoutiqueDropdown;
