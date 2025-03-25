"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function CategoryNavigation({
  categories = [],
  className,
  onClose,
  showFilters = true,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for expanded categories
  const [expandedCategories, setExpandedCategories] = useState({});

  // State for selected filters
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  // Initialize selected filters from URL on component mount
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const subcategoryParam = searchParams.get("subcategory");

    if (categoryParam) {
      const categoryIds = categoryParam.split(",");
      setSelectedCategories(categoryIds);

      // Auto-expand categories that are selected
      const expanded = { ...expandedCategories };
      categoryIds.forEach((id) => {
        expanded[id] = true;
      });
      setExpandedCategories(expanded);
    }

    if (subcategoryParam) {
      setSelectedSubCategories(subcategoryParam.split(","));
    }
  }, [searchParams]);

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Handle category selection
  const handleCategorySelect = (categoryId, isMainNavigation = false) => {
    if (isMainNavigation) {
      // For main navigation links, just navigate to the category page
      const category = categories.find((cat) => cat._id === categoryId);
      const url = category?.slug
        ? `/products/${category.slug}`
        : `/products?category=${categoryId}`;

      if (onClose) onClose();
      router.push(url);
      return;
    }

    // For filter selection, toggle the category
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        // If removing a category, also remove its subcategories
        const category = categories.find((cat) => cat._id === categoryId);
        const subCategoryIds =
          category?.subCategories.map((sub) => sub._id) || [];
        setSelectedSubCategories((prev) =>
          prev.filter((id) => !subCategoryIds.includes(id))
        );
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Handle subcategory selection
  const handleSubCategorySelect = (categoryId, subCategoryId) => {
    // Ensure parent category is selected
    if (!selectedCategories.includes(categoryId)) {
      setSelectedCategories((prev) => [...prev, categoryId]);
    }

    // Toggle subcategory
    setSelectedSubCategories((prev) => {
      if (prev.includes(subCategoryId)) {
        return prev.filter((id) => id !== subCategoryId);
      } else {
        return [...prev, subCategoryId];
      }
    });
  };

  // Apply filters and update URL
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Update category parameter
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    } else {
      params.delete("category");
    }

    // Update subcategory parameter
    if (selectedSubCategories.length > 0) {
      params.set("subcategory", selectedSubCategories.join(","));
    } else {
      params.delete("subcategory");
    }

    // Preserve other parameters like search, promo, etc.
    const url = `/products?${params.toString()}`;

    if (onClose) onClose();
    router.push(url);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedSubCategories([]);
  };

  // Count total selected filters
  const totalFiltersSelected =
    selectedCategories.length + selectedSubCategories.length;

  return (
    <div className={cn("flex flex-col", className)}>
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
            onClick={onClose}
          >
            {link.text}
          </Link>
        ))}
      </div>

      {showFilters && (
        <>
          <Separator className="my-4" />

          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Filter Products</h3>
            {totalFiltersSelected > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8 px-2 text-xs"
              >
                Reset
              </Button>
            )}
          </div>

          {/* Categories with expandable subcategories */}
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {categories.map((category) => (
              <div
                key={category._id}
                className="overflow-hidden border rounded-md"
              >
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleCategory(category._id)}
                >
                  <div className="flex items-center gap-2">
                    {showFilters ? (
                      <Checkbox
                        id={`category-${category._id}`}
                        checked={selectedCategories.includes(category._id)}
                        onCheckedChange={() =>
                          handleCategorySelect(category._id)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                    ) : null}
                    <label
                      htmlFor={`category-${category._id}`}
                      className="flex-1 text-sm font-medium cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (showFilters) {
                          handleCategorySelect(category._id);
                        } else {
                          handleCategorySelect(category._id, true);
                        }
                      }}
                    >
                      {category.designation}
                    </label>
                  </div>

                  {category.subCategories.length > 0 && (
                    <div className="flex items-center">
                      {selectedCategories.includes(category._id) && (
                        <Badge variant="outline" className="h-5 px-1 py-0 mr-2">
                          {selectedSubCategories.filter((id) =>
                            category.subCategories.some((sub) => sub._id === id)
                          ).length || "All"}
                        </Badge>
                      )}
                      {expandedCategories[category._id] ? (
                        <Minus className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  )}
                </div>

                {/* Subcategories */}
                {expandedCategories[category._id] &&
                  category.subCategories.length > 0 && (
                    <div className="pt-1 pb-3 pl-8 pr-3 border-t bg-muted/20">
                      {category.subCategories.map((subCategory) => (
                        <div
                          key={subCategory._id}
                          className="flex items-center py-1.5"
                        >
                          {showFilters ? (
                            <Checkbox
                              id={`subcategory-${subCategory._id}`}
                              checked={selectedSubCategories.includes(
                                subCategory._id
                              )}
                              onCheckedChange={() =>
                                handleSubCategorySelect(
                                  category._id,
                                  subCategory._id
                                )
                              }
                              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                          ) : null}
                          <label
                            htmlFor={`subcategory-${subCategory._id}`}
                            className="ml-2 text-sm cursor-pointer"
                            onClick={() => {
                              if (showFilters) {
                                handleSubCategorySelect(
                                  category._id,
                                  subCategory._id
                                );
                              } else {
                                // Navigate to subcategory
                                const url = subCategory.slug
                                  ? `/products/${category.slug}/${subCategory.slug}`
                                  : `/products?category=${category._id}&subcategory=${subCategory._id}`;
                                router.push(url);
                                if (onClose) onClose();
                              }
                            }}
                          >
                            {subCategory.designation}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>

          {/* Apply filters button */}
          {showFilters && totalFiltersSelected > 0 && (
            <Button onClick={applyFilters} className="mt-4">
              Apply Filters
              {totalFiltersSelected > 0 && (
                <Badge className="ml-2 bg-primary-foreground text-primary">
                  {totalFiltersSelected}
                </Badge>
              )}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
