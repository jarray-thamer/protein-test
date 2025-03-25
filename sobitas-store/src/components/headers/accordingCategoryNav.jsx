"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Plus, Minus, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AccordionCategoryNav({
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

  // Navigate to category or subcategory
  const handleNavigate = (url) => {
    router.push(url);
    if (onNavigate) onNavigate();
  };

  return (
    <div className={cn("flex flex-col space-y-1 text-left", className)}>
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
            className="uppercase hover:text-primary"
            onClick={onNavigate}
          >
            {link.text}
          </Link>
        ))}
      </div>

      <div className="hidden mb-2 text-sm font-medium text-muted-foreground">
        Categories
      </div>

      {/* Categories with expandable subcategories */}
      <div className="hidden space-y-1">
        {categories.map((category) => (
          <div key={category._id} className="overflow-hidden border rounded-md">
            <Link
              href={
                category.slug
                  ? `/products/${category.slug}`
                  : `/products?category=${category._id}`
              }
              className={cn(
                "flex items-center justify-between p-3 hover:bg-muted/50 transition-colors",
                pathname.includes(category.slug || category._id) &&
                  "bg-muted/70 font-medium"
              )}
              onClick={(e) => {
                // If there are subcategories and the plus/minus icon wasn't clicked,
                // prevent navigation and toggle expansion instead
                if (category.subCategories.length > 0 && !e.defaultPrevented) {
                  e.preventDefault();
                  toggleCategory(category._id, e);
                } else if (!category.subCategories.length) {
                  if (onNavigate) onNavigate();
                }
              }}
            >
              <span className="text-sm">{category.designation}</span>

              {category.subCategories.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => toggleCategory(category._id, e)}
                  className="flex items-center justify-center w-6 h-6 transition-colors rounded-md hover:bg-muted"
                  aria-expanded={expandedCategories[category._id]}
                  aria-label={
                    expandedCategories[category._id]
                      ? "Collapse category"
                      : "Expand category"
                  }
                >
                  {expandedCategories[category._id] ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>
              )}
            </Link>

            {/* Subcategories */}
            {expandedCategories[category._id] &&
              category.subCategories.length > 0 && (
                <div className="border-t bg-muted/20">
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
                        pathname.includes(
                          subCategory.slug || subCategory._id
                        ) && "bg-muted/40 font-medium"
                      )}
                      onClick={onNavigate}
                    >
                      <ChevronRight className="w-3 h-3 mr-2 text-muted-foreground" />
                      <span className="text-sm">{subCategory.designation}</span>
                    </Link>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
