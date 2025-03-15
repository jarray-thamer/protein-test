"use client";
import ProductCard from "@/components/shared/productCard";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/authContext";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Loader2Icon,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Slider } from "antd";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getProductListPage } from "@/services/products";
import { getCategories } from "@/services/category";
import { getSubCategories } from "@/services/subCategory";
import { useSearchParams } from "next/navigation";

const ProductsPage = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchQuery = searchParams.get("search"); // Extract search query from URL
  const [isInitializing, setIsInitializing] = useState(true);

  // États pour les filtres, la pagination et le chargement
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [tempValues, setTempValues] = useState([0, 1000]); // Valeurs temporaires du slider
  const [confirmedValues, setConfirmedValues] = useState([0, 1000]); // Valeurs confirmées
  const [selectedOption, setSelectedOption] = useState("Prix Crois"); // Option de tri
  const [currentPage, setCurrentPage] = useState(1); // Page de pagination
  const [filteredProductsList, setFilteredProductsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false); // État de chargement
  const [maxPrice, setMaxPrice] = useState(1000);

  // États pour les sections de filtres déroulantes
  const [isCategoryOpen, setIsCategoryOpen] = useState(true); // Toggle du filtre de catégorie
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(true); // Toggle du filtre de sous-catégorie
  const [isPriceOpen, setIsPriceOpen] = useState(true); // Toggle du filtre de prix
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSearch, setActiveSearch] = useState(""); // To track active search

  // Détecter la taille d'écran mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Gestionnaires d'événements
  const handleOptionChange = (event) => setSelectedOption(event.target.value);
  const handleSliderChange = (newValues) => setTempValues(newValues);

  const handlePriceConfirm = () => {
    setConfirmedValues(tempValues);
    setCurrentPage(1); // Réinitialiser à la première page quand les filtres changent
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setTempValues([0, maxPrice]);
    setConfirmedValues([0, maxPrice]);
    setSelectedOption("Prix Crois");
    setCurrentPage(1);
    setActiveSearch(""); // Clear active search
    // No need to call fetchProducts here as the useEffect will handle it
  };

  // Update active search when URL search parameter changes
  useEffect(() => {
    if (searchQuery) {
      setActiveSearch(searchQuery);
    } else {
      setActiveSearch("");
    }
  }, [searchQuery]);

  useEffect(() => {
    const initializeData = async () => {
      setIsInitializing(true);
      try {
        // 1. First fetch categories and subcategories in parallel
        const [categoriesResponse, subCategoriesResponse] = await Promise.all([
          getCategories(),
          getSubCategories(),
        ]);

        setCategories(categoriesResponse);
        setSubCategories(subCategoriesResponse);
        setFilteredSubCategories(subCategoriesResponse);

        // 2. Get max price
        const priceResponse = await getProductListPage("sort=-price&limit=1");
        if (priceResponse.data.products?.length > 0) {
          const maxPriceValue = Math.ceil(priceResponse.data.products[0].price);
          setMaxPrice(maxPriceValue);
          setTempValues([0, maxPriceValue]);
          setConfirmedValues([0, maxPriceValue]);
        }

        // 3. Apply any URL parameters (like category filter)
        if (categoriesResponse.length > 0 && categoryParam) {
          const categoryExists = categoriesResponse.some(
            (cat) => cat.designation === categoryParam
          );
          if (categoryExists) {
            setSelectedCategories([categoryParam]);
          }
        }

        // 4. Now fetch products only once with the initialized filters
        await fetchProductsInternal();
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeData();
  }, [categoryParam]); // Only depend on URL parameters

  // Create an internal fetch function that doesn't depend on state
  const fetchProductsInternal = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();

      // Add your filter logic here (same as in fetchProducts)
      selectedCategories.forEach((designation) =>
        queryParams.append("category", designation)
      );

      selectedSubCategories.forEach((designation) =>
        queryParams.append("subCategory", designation)
      );

      queryParams.set("minPrice", confirmedValues[0]);
      queryParams.set("maxPrice", confirmedValues[1]);
      queryParams.set("page", currentPage);
      queryParams.set("limit", 10);

      // Add search query if exists
      if (activeSearch) {
        queryParams.set("search", activeSearch);
      }

      const sortParam =
        selectedOption === "Prix Crois"
          ? "price"
          : selectedOption === "Prix Décrois"
          ? "-price"
          : "-createdAt";
      queryParams.set("sort", sortParam);

      const response = await getProductListPage(queryParams.toString());
      setFilteredProductsList(response.data.products || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Then modify your main fetchProducts function to use this method
  const fetchProducts = useCallback(() => {
    if (isInitializing) return; // Don't fetch during initialization
    fetchProductsInternal();
  }, [
    selectedCategories,
    selectedSubCategories,
    confirmedValues,
    selectedOption,
    currentPage,
    isInitializing,
    activeSearch,
  ]);

  const handleCategoryChange = (designation, isChecked) => {
    setSelectedCategories((prev) =>
      isChecked
        ? [...prev, designation]
        : prev.filter((cat) => cat !== designation)
    );
    setCurrentPage(1); // Reset to first page
  };

  // For subcategory changes
  const handleSubCategoryChange = (designation, isChecked) => {
    setSelectedSubCategories((prev) =>
      isChecked
        ? [...prev, designation]
        : prev.filter((subCat) => subCat !== designation)
    );
    setCurrentPage(1); // Reset to first page
  };

  useEffect(() => {
    if (!isInitializing) {
      fetchProducts();
    }
  }, [fetchProducts, isInitializing]);

  // Clear search function
  const clearSearch = () => {
    setActiveSearch("");
    // Now we need to update the URL without the search parameter
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("search");
    window.history.pushState({}, "", `?${newParams.toString()}`);
  };

  // Render pagination items
  const renderPaginationItems = () => {
    if (!pagination?.totalPages) return null;

    const items = [];

    // Add Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
      </PaginationItem>
    );

    // Add page numbers
    for (let i = 1; i <= pagination.totalPages; i++) {
      items.push(
        <PaginationItem key={i}>
          <button
            className={`h-8 w-8 rounded-md ${
              currentPage === i
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        </PaginationItem>
      );
    }

    // Add Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))
          }
          disabled={currentPage === pagination.totalPages}
        />
      </PaginationItem>
    );

    return items;
  };

  return (
    <div className="flex mx-auto mt-12 max-w-screen-2xl">
      {/* Bouton de Filtre Mobile */}
      {isMobile && (
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="fixed z-[999999] flex items-center gap-2 px-4 py-2 text-white bg-primary bottom-4 right-4 rounded-2xl"
        >
          {isMobileFiltersOpen ? (
            <PanelLeftClose size={20} />
          ) : (
            <PanelLeftOpen size={20} />
          )}
          Filtres
        </button>
      )}
      {isInitializing ? (
        <div className="flex items-center justify-center w-full min-h-[70vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2Icon size={40} className="animate-spin text-primary" />
            <p className="text-gray-500">Chargement des produits...</p>
          </div>
        </div>
      ) : (
        <div className="flex w-full">
          {/* Section des Filtres - Adaptée pour mobile */}
          {(isMobileFiltersOpen || !isMobile) && (
            <motion.div
              initial={isMobile ? { x: "-100%" } : {}}
              animate={isMobile ? { x: 0 } : {}}
              transition={{ type: "tween" }}
              className={`w-full mt-20 md:w-1/4 px-6 ${
                isMobile
                  ? "fixed inset-0 z-20 bg-white h-screen overflow-y-auto"
                  : "relative"
              }`}
            >
              {/* Bouton de fermeture pour mobile */}
              {isMobile && (
                <div className="flex items-center justify-between mb-4">
                  <h6 className="text-lg">Filtres</h6>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-2 text-gray-500 hover:text-primary"
                  >
                    <X size={24} />
                  </button>
                </div>
              )}

              <div className="flex justify-between">
                <h6>Filtres:</h6>
                <h6
                  onClick={resetFilters}
                  className="text-[12px] cursor-pointer text-primary/70 hover:text-primary/100"
                >
                  Tout Effacer
                </h6>
              </div>
              <Separator className="my-6" />

              {/* Filtre de Catégorie */}
              <div className="pb-4 border-b">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center justify-between text-[18px] w-full pb-2 font-normal tracking-wide"
                >
                  Catégorie
                  {isCategoryOpen ? (
                    <ChevronDownIcon size={18} />
                  ) : (
                    <ChevronUpIcon size={18} />
                  )}
                </button>
                <motion.div
                  animate={{
                    height: isCategoryOpen ? "auto" : 0,
                    opacity: isCategoryOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: "easeIn" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2">
                    {categories?.map((category) => (
                      <label
                        key={category._id}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={category.designation}
                          checked={selectedCategories.includes(
                            category.designation
                          )}
                          onChange={(e) =>
                            handleCategoryChange(
                              e.target.value,
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 accent-black"
                        />
                        <span className="ml-2 text-gray-700 capitalize">
                          {category.designation.toLowerCase()}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Filtre de Sous-Catégorie */}
              <div className="pb-4 border-b">
                <button
                  onClick={() => setIsSubCategoryOpen(!isSubCategoryOpen)}
                  className="flex items-center justify-between text-[18px] w-full pb-2 font-normal tracking-wide"
                >
                  Sous-Catégorie
                  {isSubCategoryOpen ? (
                    <ChevronDownIcon size={18} />
                  ) : (
                    <ChevronUpIcon size={18} />
                  )}
                </button>
                <motion.div
                  animate={{
                    height: isSubCategoryOpen ? "auto" : 0,
                    opacity: isSubCategoryOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: "easeIn" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2">
                    {filteredSubCategories.length > 0 ? (
                      filteredSubCategories.map((subCategory) => (
                        <label
                          key={subCategory._id}
                          className="flex items-center cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={subCategory.designation}
                            checked={selectedSubCategories.includes(
                              subCategory.designation
                            )}
                            onChange={(e) =>
                              handleSubCategoryChange(
                                e.target.value,
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 accent-black"
                          />
                          <span className="ml-2 text-gray-700 capitalize">
                            {subCategory.designation.toLowerCase()}
                          </span>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        {selectedCategories.length > 0
                          ? "Aucune sous-catégorie disponible pour les catégories sélectionnées"
                          : "Veuillez sélectionner une catégorie pour voir les sous-catégories"}
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Filtre de Prix */}
              <div className="pb-4 border-b">
                <button
                  onClick={() => setIsPriceOpen(!isPriceOpen)}
                  className="flex items-center justify-between text-[18px] w-full pb-2 font-normal tracking-wide"
                >
                  Prix
                  {isPriceOpen ? (
                    <ChevronDownIcon size={18} />
                  ) : (
                    <ChevronUpIcon size={18} />
                  )}
                </button>
                <motion.div
                  animate={{
                    height: isPriceOpen ? "auto" : 0,
                    opacity: isPriceOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: "easeIn" }}
                  className="overflow-hidden"
                >
                  <div className="my-3 space-y-2">
                    <p className="text-sm">
                      Fourchette de prix:{" "}
                      <span className="text-primary">
                        {tempValues[0]} TND - {tempValues[1]} TND
                      </span>
                    </p>
                    <Slider
                      range
                      min={0}
                      max={maxPrice}
                      value={tempValues}
                      onChange={handleSliderChange}
                    />
                    <button
                      onClick={handlePriceConfirm}
                      className="w-full py-2 text-sm text-white transition-colors rounded-md bg-primary hover:bg-primary/90"
                    >
                      Confirmer la fourchette de prix
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Affichage des filtres actifs */}
              {(selectedCategories.length > 0 ||
                selectedSubCategories.length > 0 ||
                confirmedValues[0] > 0 ||
                confirmedValues[1] < maxPrice ||
                activeSearch) && (
                <div className="mt-4">
                  <h6 className="mb-2 text-sm font-medium">Filtres actifs:</h6>
                  <div className="flex flex-wrap gap-2">
                    {/* Display search query as a filter if active */}
                    {activeSearch && (
                      <div className="flex items-center px-2 py-1 text-xs bg-gray-100 rounded-md">
                        Recherche: {activeSearch}
                        <X
                          size={14}
                          className="ml-1 cursor-pointer"
                          onClick={clearSearch}
                        />
                      </div>
                    )}

                    {selectedCategories.map((designation) => {
                      const category = categories.find(
                        (c) => c.designation === designation
                      );
                      return (
                        category && (
                          <div
                            key={designation}
                            className="flex items-center px-2 py-1 text-xs bg-gray-100 rounded-md"
                          >
                            {category.designation}
                            <X
                              size={14}
                              className="ml-1 cursor-pointer"
                              onClick={() =>
                                setSelectedCategories((prev) =>
                                  prev.filter((s) => s !== designation)
                                )
                              }
                            />
                          </div>
                        )
                      );
                    })}

                    {selectedSubCategories.map((designation) => {
                      const subCategory = subCategories.find(
                        (c) => c.designation === designation
                      );
                      return (
                        subCategory && (
                          <div
                            key={designation}
                            className="flex items-center px-2 py-1 text-xs bg-gray-100 rounded-md"
                          >
                            {subCategory.designation}
                            <X
                              size={14}
                              className="ml-1 cursor-pointer"
                              onClick={() =>
                                setSelectedSubCategories((prev) =>
                                  prev.filter((s) => s !== designation)
                                )
                              }
                            />
                          </div>
                        )
                      );
                    })}

                    {(confirmedValues[0] > 0 ||
                      confirmedValues[1] < maxPrice) && (
                      <div className="flex items-center px-2 py-1 text-xs bg-gray-100 rounded-md">
                        Prix: {confirmedValues[0]} - {confirmedValues[1]} TND
                        <X
                          size={14}
                          className="ml-1 cursor-pointer"
                          onClick={() => {
                            setTempValues([0, maxPrice]);
                            setConfirmedValues([0, maxPrice]);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Section des Produits */}
          <div
            className={`flex-1 px-6 ${
              isMobileFiltersOpen ? "hidden md:block" : ""
            }`}
          >
            <div className="flex flex-col mb-6 md:flex-row md:justify-between">
              <h6 className="text-sm text-[#ccc] mb-2 md:mb-0">
                Affichage{" "}
                <span className="text-black3">
                  {filteredProductsList?.length} sur {pagination?.total || 0}
                </span>{" "}
                Produits
              </h6>
              <div className="flex items-center gap-4">
                <p className="text-[#666666] text-[12px]">Trier par:</p>
                <select
                  value={selectedOption}
                  onChange={handleOptionChange}
                  className="px-2 py-1 bg-white border border-gray-300 shadow-sm text-[13px] text-[#999999] rounded-md"
                >
                  <option value="Prix Crois">Prix Croissant</option>
                  <option value="Prix Décrois">Prix Décroissant</option>
                  <option value="Nouveau">Plus Récent</option>
                </select>
              </div>
            </div>

            {/* Display search results message if search is active */}
            {activeSearch && (
              <div className="p-3 mb-6 rounded-md bg-gray-50">
                <p className="text-sm">
                  Résultats pour{" "}
                  <span className="font-medium">"{activeSearch}"</span> (
                  {pagination?.total || 0} produits trouvés)
                </p>
              </div>
            )}

            {/* Chargement, Produits, ou Aucun Produit */}
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2Icon className="animate-spin" />
              </div>
            ) : filteredProductsList.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 mx-auto w-fit md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProductsList.map((productData) => (
                    <ProductCard
                      key={productData.slug}
                      user={user}
                      product={productData}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <Pagination className="flex justify-center mt-8">
                    <PaginationContent>
                      {renderPaginationItems()}
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p>Aucun produit trouvé</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
