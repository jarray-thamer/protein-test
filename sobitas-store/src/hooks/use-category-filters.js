"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createUrlWithParams } from "@/lib/url-helpers";

export function useCategoryFilters({
  initialCategories = [],
  initialSubCategories = [],
} = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] =
    useState(initialCategories);
  const [selectedSubCategories, setSelectedSubCategories] =
    useState(initialSubCategories);

  // Initialize from URL on mount
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const subcategoryParam = searchParams.get("subcategory");

    if (categoryParam) {
      setSelectedCategories(categoryParam.split(","));
    }

    if (subcategoryParam) {
      setSelectedSubCategories(subcategoryParam.split(","));
    }
  }, [searchParams]);

  // Toggle category selection
  const toggleCategory = (categoryId, subCategoryIds = []) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        // If removing a category, also remove its subcategories
        setSelectedSubCategories((prev) =>
          prev.filter((id) => !subCategoryIds.includes(id))
        );
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Toggle subcategory selection
  const toggleSubCategory = (categoryId, subCategoryId) => {
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
  const applyFilters = (baseUrl = "/products") => {
    const url = createUrlWithParams(baseUrl, searchParams, {
      category: selectedCategories.length > 0 ? selectedCategories : null,
      subcategory:
        selectedSubCategories.length > 0 ? selectedSubCategories : null,
    });

    router.push(url);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedSubCategories([]);
  };

  return {
    selectedCategories,
    selectedSubCategories,
    toggleCategory,
    toggleSubCategory,
    applyFilters,
    resetFilters,
    totalFiltersSelected:
      selectedCategories.length + selectedSubCategories.length,
  };
}
