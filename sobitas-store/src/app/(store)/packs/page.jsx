"use client";
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
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/shared/productCard"; // You might want to rename this or create a PackCard component

// Assuming you'll create this service function similar to getProductListPage
import { getPackListPage } from "@/services/packs";

const PacksPage = () => {
  const { user } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  // States for filters, pagination and loading
  const [tempValues, setTempValues] = useState([0, 1000]); // Temporary slider values
  const [confirmedValues, setConfirmedValues] = useState([0, 1000]); // Confirmed values
  const [selectedOption, setSelectedOption] = useState("Prix Crois"); // Sort option
  const [currentPage, setCurrentPage] = useState(1); // Pagination page
  const [filteredPacksList, setFilteredPacksList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [maxPrice, setMaxPrice] = useState(1000);

  // States for dropdown filter sections
  const [isPriceOpen, setIsPriceOpen] = useState(true); // Price filter toggle
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Event handlers
  const handleOptionChange = (event) => setSelectedOption(event.target.value);
  const handleSliderChange = (newValues) => setTempValues(newValues);

  const handlePriceConfirm = () => {
    setConfirmedValues(tempValues);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setTempValues([0, maxPrice]);
    setConfirmedValues([0, maxPrice]);
    setSelectedOption("Prix Crois");
    setCurrentPage(1);
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsInitializing(true);
      try {
        // Get max price
        const priceResponse = await getPackListPage("sort=-price&limit=1");
        if (priceResponse.data.packs?.length > 0) {
          const maxPriceValue = Math.ceil(priceResponse.data.packs[0].price);
          setMaxPrice(maxPriceValue);
          setTempValues([0, maxPriceValue]);
          setConfirmedValues([0, maxPriceValue]);
        }

        // Now fetch packs with the initialized filters
        await fetchPacksInternal();
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeData();
  }, []); // No dependencies as we only want to run this once on mount

  // Create an internal fetch function that doesn't depend on state
  const fetchPacksInternal = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();

      // Add filter logic
      queryParams.set("minPrice", confirmedValues[0]);
      queryParams.set("maxPrice", confirmedValues[1]);
      queryParams.set("page", currentPage);
      queryParams.set("limit", 10);

      const sortParam =
        selectedOption === "Prix Crois"
          ? "price"
          : selectedOption === "Prix Décrois"
          ? "-price"
          : "-createdAt";
      queryParams.set("sort", sortParam);

      const response = await getPackListPage(queryParams.toString());
      setFilteredPacksList(response.data.packs || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error("Erreur lors de la récupération des packs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Main fetchPacks function
  const fetchPacks = useCallback(() => {
    if (isInitializing) return; // Don't fetch during initialization
    fetchPacksInternal();
  }, [confirmedValues, selectedOption, currentPage, isInitializing]);

  useEffect(() => {
    if (!isInitializing) {
      fetchPacks();
    }
  }, [fetchPacks, isInitializing]);

  // Pagination rendering helper function
  const renderPaginationItems = () => {
    const items = [];

    // Previous button
    if (pagination.currentPage > 1) {
      items.push(
        <PaginationItem key="prev">
          <PaginationPrevious
            onClick={() => setCurrentPage(pagination.currentPage - 1)}
          />
        </PaginationItem>
      );
    }

    // Page numbers
    const totalPages = pagination.totalPages || 1;
    const currentPageNum = pagination.currentPage || 1;

    // Show first page
    if (currentPageNum > 2) {
      items.push(
        <PaginationItem key={1}>
          <button
            onClick={() => setCurrentPage(1)}
            className={`px-3 py-1 rounded-md ${
              currentPageNum === 1 ? "bg-primary text-white" : "text-gray-600"
            }`}
          >
            1
          </button>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (currentPageNum > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <span className="px-2">...</span>
        </PaginationItem>
      );
    }

    // Current page and adjacent pages
    for (
      let i = Math.max(1, currentPageNum - 1);
      i <= Math.min(totalPages, currentPageNum + 1);
      i++
    ) {
      if (i !== 1 && i !== totalPages) {
        items.push(
          <PaginationItem key={i}>
            <button
              onClick={() => setCurrentPage(i)}
              className={`px-3 py-1 rounded-md ${
                currentPageNum === i ? "bg-primary text-white" : "text-gray-600"
              }`}
            >
              {i}
            </button>
          </PaginationItem>
        );
      }
    }

    // Show ellipsis if needed
    if (currentPageNum < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <span className="px-2">...</span>
        </PaginationItem>
      );
    }

    // Show last page
    if (totalPages > 1 && currentPageNum < totalPages) {
      items.push(
        <PaginationItem key={totalPages}>
          <button
            onClick={() => setCurrentPage(totalPages)}
            className={`px-3 py-1 rounded-md ${
              currentPageNum === totalPages
                ? "bg-primary text-white"
                : "text-gray-600"
            }`}
          >
            {totalPages}
          </button>
        </PaginationItem>
      );
    }

    // Next button
    if (currentPageNum < totalPages) {
      items.push(
        <PaginationItem key="next">
          <PaginationNext
            onClick={() => setCurrentPage(pagination.currentPage + 1)}
          />
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="flex mx-auto mt-12 max-w-screen-2xl">
      {/* Mobile Filter Button */}
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
            <p className="text-gray-500">Chargement des packs...</p>
          </div>
        </div>
      ) : (
        <div className="flex w-full">
          {/* Filters Section - Mobile responsive */}
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
              {/* Close button for mobile */}
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

              {/* Price Filter */}
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

              {/* Display active filters */}
              {(confirmedValues[0] > 0 || confirmedValues[1] < maxPrice) && (
                <div className="mt-4">
                  <h6 className="mb-2 text-sm font-medium">Filtres actifs:</h6>
                  <div className="flex flex-wrap gap-2">
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

          {/* Packs Section */}
          <div
            className={`flex-1 px-6 ${
              isMobileFiltersOpen ? "hidden md:block" : ""
            }`}
          >
            <div className="flex flex-col mb-6 md:flex-row md:justify-between">
              <h6 className="text-sm text-[#ccc] mb-2 md:mb-0">
                Affichage{" "}
                <span className="text-black3">
                  {filteredPacksList?.length} sur {pagination?.total || 0}
                </span>{" "}
                Packs
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

            {/* Loading, Packs, or No Packs */}
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2Icon className="animate-spin" />
              </div>
            ) : filteredPacksList.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 mx-auto w-fit md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredPacksList.map((packData) => (
                    <ProductCard
                      key={packData.slug}
                      user={user}
                      product={packData}
                      type="packs" // Add a prop to distinguish packs from products
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
                <p>Aucun pack trouvé</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PacksPage;
