"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlignJustifyIcon,
  PhoneIcon,
  Search,
  UserRoundIcon,
  ShoppingBag,
  Heart,
  X,
  ChevronDown,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import useWishlistStore from "@/store/wishlist";
import useInformationStore from "@/store/information";
import EnhancedSearchForm from "./searchForm";
import AccordionCategoryNav from "./accordingCategoryNav";
import { getCategories } from "@/services/category";
import {
  InstagramIcon,
  YoutubeIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "lucide-react";
import TopHeader from "./topHeader";
import BoutiqueDropdown from "./dropDownBoutique";
import { useAuthStore } from "@/store/authStore";

export const NavHeader = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { wishlistCount } = useWishlistStore();
  const { information } = useInformationStore();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showBoutiqueDropdown, setShowBoutiqueDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const dropdownTimeoutRef = useRef(null);

  // Handle search results
  const handleSearch = (results) => {
    // Implementation for search results
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();
      setCategories(res);
    };
    fetchCategories();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close expanded search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const searchContainer = document.getElementById(
        "header-search-container"
      );
      if (
        searchContainer &&
        !searchContainer.contains(event.target) &&
        isSearchExpanded
      ) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchExpanded]);

  // Close the sheet
  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  };

  // Handle dropdown hover with delay
  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setShowBoutiqueDropdown(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowBoutiqueDropdown(false);
    }, 300);
  };

  const { user } = useAuthStore();

  return (
    <>
      <TopHeader />
      <div className="flex-col hidden w-screen mx-auto md:flex max-w-screen-2xl">
        <div className="font-light flex justify-end items-center text-[#777777] text-[14px] 2xl:text-base uppercase py-2 space-x-6 px-4">
          <Link
            href="/"
            className="flex items-center space-x-1 transition-colors duration-200 hover:text-primary"
          >
            <PhoneIcon
              size={6}
              strokeWidth={1.8}
              className="size-[12px] 2xl:size-[13px]"
            />
            <h6>CALL: {information?.general?.contact?.fax}</h6>
          </Link>

          <Link
            href="/contact-us"
            className="transition-colors duration-200 hover:text-primary"
          >
            contact us
          </Link>
          {user ? (
            <Link
              href={`/auth/profile`}
              className="flex items-center justify-center space-x-1 transition-colors duration-200 hover:text-primary"
            >
              <UserRoundIcon
                size={6}
                strokeWidth={2}
                className="size-[14px] 2xl:size-[16px] m-0 p-0"
              />
              <span>Profil</span>
            </Link>
          ) : (
            <Link
              href={`/auth/login`}
              className="flex items-center justify-center space-x-1 transition-colors duration-200 hover:text-primary"
            >
              <UserRoundIcon
                size={6}
                strokeWidth={2}
                className="size-[14px] 2xl:size-[16px] m-0 p-0"
              />
              <span>login</span>
            </Link>
          )}
        </div>
        <Separator className="h-0.5 px-12" />
      </div>

      <motion.div
        className={`sticky top-0 z-50 w-full bg-white ${
          isScrolled ? "shadow-lg" : "shadow-sm"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="relative flex items-center justify-between w-screen px-4 py-4 mx-auto text-black3 max-w-screen-2xl">
          {/*logo and navigations*/}
          <div className="relative flex items-center space-x-8 text-sm uppercase">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href="/">
                <Image
                  src={information?.general?.logo?.url || "/logo.png"}
                  alt={"logo"}
                  height={1080}
                  width={1440}
                  className="h-auto w-44 md:w-[200px]"
                  priority
                />
              </Link>
            </motion.div>

            <div
              className="relative"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                className="items-center hidden space-x-1 transition-colors duration-200 lg:flex hover:text-primary"
                href={"/products"}
              >
                <h6>Boutique</h6>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${
                    showBoutiqueDropdown ? "rotate-180" : ""
                  }`}
                />
              </Link>
              <AnimatePresence>
                {showBoutiqueDropdown && <BoutiqueDropdown />}
              </AnimatePresence>
            </div>

            <NavLink href="/products?promo=true" label="Promotion" />
            <NavLink href="/#nos-marques" label="Marques" />
            <NavLink href="/packs" label="Packs" />
            <NavLink href="/contact-us" label="Contact" />
          </div>

          {/* Desktop search and icons */}
          <div className="flex items-center space-x-6">
            <div className="hidden w-full max-w-xl lg:block">
              <EnhancedSearchForm
                categories={categories}
                onSearch={handleSearch}
                className="header-search"
                placeholder="Search products..."
              />
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-100 lg:hidden"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* <Link
                href="/wishlist"
                className="relative p-2 transition-colors duration-200 rounded-full hover:bg-gray-100"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white rounded-full -top-1 -right-1 bg-primary">
                    {wishlistCount}
                  </span>
                )}
              </Link> */}

              {/* <Link
                href="/cart"
                className="relative p-2 transition-colors duration-200 rounded-full hover:bg-gray-100"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white rounded-full -top-1 -right-1 bg-primary">
                  0
                </span>
              </Link> */}
            </div>

            {/* Mobile menu trigger */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger className="flex ml-4 lg:hidden">
                <AlignJustifyIcon
                  strokeWidth={1.8}
                  size={28}
                  className="cursor-pointer"
                />
              </SheetTrigger>

              {/* Mobile menu sheet content */}
              <SheetContent
                side="left"
                className="z-[999] overflow-y-auto"
                onInteractOutside={(e) => e.preventDefault()}
              >
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    <Link href="/" onClick={handleCloseSheet}>
                      <Image
                        src="/logo.png"
                        width={120}
                        height={1080}
                        alt="logo"
                      />
                    </Link>
                    <button
                      onClick={handleCloseSheet}
                      className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-100"
                    >
                      <X size={20} />
                    </button>
                  </SheetTitle>
                  <SheetDescription className="relative">
                    <div className="mt-4 mb-6">
                      <EnhancedSearchForm
                        categories={categories}
                        onSearch={handleSearch}
                        className="mobile-drawer-search"
                        placeholder="Search products..."
                        isMobile={true}
                      />
                    </div>

                    {/*  Category Navigation with filtering */}
                    <AccordionCategoryNav
                      categories={categories}
                      onNavigate={handleCloseSheet}
                    />
                  </SheetDescription>
                </SheetHeader>
                <SheetFooter className="bottom-0 mt-auto">
                  <div className="flex flex-wrap gap-4 mt-6">
                    <SocialIcon
                      href={information?.general?.social?.facebookUrl}
                    >
                      <FacebookIcon size={20} />
                    </SocialIcon>
                    <SocialIcon href={information?.general?.social?.twitterUrl}>
                      <TwitterIcon size={20} />
                    </SocialIcon>
                    <SocialIcon
                      href={information?.general?.social?.instagramUrl}
                    >
                      <InstagramIcon size={20} />
                    </SocialIcon>
                    <SocialIcon href={information?.general?.social?.youtubeUrl}>
                      <YoutubeIcon size={20} />
                    </SocialIcon>
                    <SocialIcon
                      href={information?.general?.social?.linkedInUrl}
                    >
                      <LinkedinIcon size={20} />
                    </SocialIcon>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Expandable mobile search - shows when search icon is clicked */}
        <AnimatePresence>
          {isSearchExpanded && (
            <motion.div
              id="header-search-container"
              className="px-4 py-3 bg-white border-t lg:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EnhancedSearchForm
                categories={categories}
                onSearch={handleSearch}
                className="mobile-expanded-search"
                placeholder="Search products..."
                isMobile={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

// Helper component for navigation links
const NavLink = ({ href, label }) => (
  <Link
    className="items-center hidden ml-6 transition-colors duration-200 lg:flex hover:text-primary group"
    href={href}
  >
    <h6 className="relative">
      {label}
      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
    </h6>
  </Link>
);

// Helper component for social icons
const SocialIcon = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-100"
  >
    {children}
  </a>
);

export default NavHeader;
