"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Plus, Minus, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedAccordionNav({
  categories = [],
  className,
  onNavigate,
}) {
  const router = useRouter();
  const pathname = usePathname();

  // State for expanded categories
  const [expandedCategories, setExpandedCategories] = useState({});

  // Toggle category expansion
  const toggleCategory = (categoryId, e) => {
    e.preventDefault();
    e.stopPropagation();

    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Check if a category or subcategory is active based on the current URL
  const isActive = (slug, id) => {
    if (slug && pathname.includes(slug)) return true;
    if (pathname.includes(`category=${id}`)) return true;
    return false;
  };

  // Auto-expand categories based on the current URL
  useEffect(() => {
    const newExpanded = { ...expandedCategories };
    let shouldUpdate = false;

    categories.forEach((category) => {
      if (isActive(category.slug, category._id)) {
        if (!newExpanded[category._id]) {
          newExpanded[category._id] = true;
          shouldUpdate = true;
        }
      }

      // Also expand if any subcategory is active
      category.subCategories.forEach((subCategory) => {
        if (isActive(subCategory.slug, subCategory._id)) {
          if (!newExpanded[category._id]) {
            newExpanded[category._id] = true;
            shouldUpdate = true;
          }
        }
      });
    });

    if (shouldUpdate) {
      setExpandedCategories(newExpanded);
    }
  }, [pathname, categories]);

  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      {/* Main navigation links */}
      <div className="flex flex-col mb-6 space-y-4">
        {[
          { href: "/products", text: "Boutique" },
          { href: "/products?promo=true", text: "Promotion" },
          { href: "/#nos-marques", text: "Marques" },
          { href: "/packs", text: "Packs" },
          { href: "/contact-us", text: "Contact" },
        ].map((link) => (
          <Link
            key={link.text}
            href={link.href}
            className={cn(
              "uppercase hover:text-primary transition-colors",
              pathname === link.href && "text-primary font-medium"
            )}
            onClick={onNavigate}
          >
            {link.text}
          </Link>
        ))}
      </div>

      <div className="mb-2 text-sm font-medium text-muted-foreground">
        Categories
      </div>

      {/* Categories with expandable subcategories */}
      <div className="space-y-1">
        {categories.map((category) => (
          <div key={category._id} className="overflow-hidden border rounded-md">
            <div className="flex items-center">
              <Link
                href={
                  category.slug
                    ? `/products/${category.slug}`
                    : `/products?category=${category._id}`
                }
                className={cn(
                  "flex-1 py-3 px-3 hover:bg-muted/50 transition-colors",
                  isActive(category.slug, category._id) &&
                    "bg-muted/70 font-medium"
                )}
                onClick={(e) => {
                  if (category.subCategories.length > 0) {
                    // If there are subcategories, don't navigate on category click
                    // Instead, toggle the expansion
                    e.preventDefault();
                    toggleCategory(category._id, e);
                  } else if (onNavigate) {
                    onNavigate();
                  }
                }}
              >
                <span className="text-sm">{category.designation}</span>
              </Link>

              {category.subCategories.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => toggleCategory(category._id, e)}
                  className="flex items-center justify-center w-10 h-10 transition-colors hover:bg-muted"
                  aria-expanded={expandedCategories[category._id]}
                  aria-label={
                    expandedCategories[category._id]
                      ? "Collapse category"
                      : "Expand category"
                  }
                  aria-controls={`subcategory-list-${category._id}`}
                >
                  {expandedCategories[category._id] ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            {/* Animated subcategories */}
            <AnimatePresence initial={false}>
              {expandedCategories[category._id] &&
                category.subCategories.length > 0 && (
                  <motion.div
                    id={`subcategory-list-${category._id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t bg-muted/20"
                  >
                    {category.subCategories.map((subCategory) => (
                      <Link
                        key={subCategory._id}
                        href={
                          subCategory.slug
                            ? `/products/${category.slug}/${subCategory.slug}`
                            : `/products?category=${category._id}&subcategory=${subCategory._id}`
                        }
                        className={cn(
                          "flex items-center pl-6 pr-3 py-2 hover:bg-muted/30 transition-colors",
                          isActive(subCategory.slug, subCategory._id) &&
                            "bg-muted/40 font-medium"
                        )}
                        onClick={onNavigate}
                      >
                        <ChevronRight className="w-3 h-3 mr-2 text-muted-foreground" />
                        <span className="text-sm">
                          {subCategory.designation}
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
