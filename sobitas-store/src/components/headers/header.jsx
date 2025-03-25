"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlignJustifyIcon, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import useWishlistStore from "@/store/wishlist";
import useInformationStore from "@/store/information";
import EnhancedSearchForm from "./searchForm";
import CategoryNavigation from "./categoryNavigation";
import { getCategories } from "@/services/category";
import AccordionCategoryNav from "./accordingCategoryNav";
import { InstagramFilled, YoutubeFilled } from "@ant-design/icons";

export const NavHeader = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { wishlistCount } = useWishlistStore();
  const { information } = useInformationStore();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Handle search results
  const handleSearch = (results) => {
    // You can use this to show a dropdown of results or other UI feedback
    console.log("Search results:", results);
  };

  // Toggle search expansion on mobile
  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

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

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();
      setCategories(res);
    };
    fetchCategories();
  }, []);

  // Close the sheet
  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-4 mx-auto text-black3 max-w-screen-2xl">
          {/*logo and navigations*/}
          <div className="flex items-center space-x-8 text-sm uppercase">
            <Link href="/">
              <Image
                src={information?.general?.logo?.url || "/logo.png"}
                alt={"logo"}
                height={1080}
                width={1440}
                className="h-auto w-44 md:w-[200px]"
              />
            </Link>
            <Link
              className="items-center hidden ml-6 lg:flex hover:text-primary"
              href={"/products"}
            >
              <h6>Boutique</h6>
            </Link>
            <Link
              className="items-center hidden ml-6 lg:flex hover:text-primary"
              href={"/products?promo=true"}
            >
              <h6>Promotion</h6>
            </Link>
            <Link
              className="items-center hidden ml-6 lg:flex hover:text-primary"
              href={"/#nos-marques"}
            >
              <h6>Marques</h6>
            </Link>
            <Link
              className="items-center hidden ml-6 lg:flex hover:text-primary"
              href={"/packs"}
            >
              <h6>Packs</h6>
            </Link>
            <Link
              className="items-center hidden ml-6 lg:flex hover:text-primary"
              href={"/contact-us"}
            >
              <h6>Contact</h6>
            </Link>
          </div>

          {/* Desktop search */}
          <div className="hidden w-1/2 max-w-xl lg:block">
            <EnhancedSearchForm
              categories={categories}
              onSearch={handleSearch}
              className="header-search"
              placeholder="Search products..."
            />
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
                <SheetTitle>
                  <Link href="/" onClick={handleCloseSheet}>
                    <Image
                      src="/logo.png"
                      width={120}
                      height={1080}
                      alt="logo"
                    />
                  </Link>
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
                  <a
                    href={information?.general?.social?.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className=""
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-facebook"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                  <a
                    href={information?.general?.social?.twitterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className=""
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 12 12"
                    >
                      <path d="M.076 0H3.61l3.145 4.498L10.53 0h1.129L7.185 5.114L12 12H8.468L5.183 7.303L1.128 12H0l4.753-5.312z"></path>
                    </svg>
                  </a>
                  <a
                    href={information?.general?.social?.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className=""
                  >
                    <InstagramFilled className="text-[20px]" />
                  </a>
                  <a
                    href={information?.general?.social?.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className=""
                  >
                    <YoutubeFilled className="text-[20px]" />
                  </a>
                  <a
                    href={information?.general?.social?.linkedInUrl}
                    target="_blank"
                    rel="noreferrer"
                    className=""
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.47 2H3.53a1.45 1.45 0 0 0-1.47 1.43v17.14A1.45 1.45 0 0 0 3.53 22h16.94a1.45 1.45 0 0 0 1.47-1.43V3.43A1.45 1.45 0 0 0 20.47 2M8.09 18.74h-3v-9h3ZM6.59 8.48a1.56 1.56 0 1 1 0-3.12a1.57 1.57 0 1 1 0 3.12m12.32 10.26h-3v-4.83c0-1.21-.43-2-1.52-2A1.65 1.65 0 0 0 12.85 13a2 2 0 0 0-.1.73v5h-3v-9h3V11a3 3 0 0 1 2.71-1.5c2 0 3.45 1.29 3.45 4.06Z"></path>
                    </svg>
                  </a>
                  <a
                    href={information?.general?.social?.pinterestUrl}
                    target="_blank"
                    rel="noreferrer"
                    className=""
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                    >
                      <path d="M9.04 21.54c.96.29 1.93.46 2.96.46a10 10 0 0 0 10-10A10 10 0 0 0 12 2A10 10 0 0 0 2 12c0 4.25 2.67 7.9 6.44 9.34c-.09-.78-.18-2.07 0-2.96l1.15-4.94s-.29-.58-.29-1.5c0-1.38.86-2.41 1.84-2.41c.86 0 1.26.63 1.26 1.44c0 .86-.57 2.09-.86 3.27c-.17.98.52 1.84 1.52 1.84c1.78 0 3.16-1.9 3.16-4.58c0-2.4-1.72-4.04-4.19-4.04c-2.82 0-4.48 2.1-4.48 4.31c0 .86.28 1.73.74 2.3c.09.06.09.14.06.29l-.29 1.09c0 .17-.11.23-.28.11c-1.28-.56-2.02-2.38-2.02-3.85c0-3.16 2.24-6.03 6.56-6.03c3.44 0 6.12 2.47 6.12 5.75c0 3.44-2.13 6.2-5.18 6.2c-.97 0-1.92-.52-2.26-1.13l-.67 2.37c-.23.86-.86 2.01-1.29 2.7z"></path>
                    </svg>
                  </a>
                  <a
                    href={information?.general?.social?.whatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className=""
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 1.25c5.937 0 10.75 4.813 10.75 10.75S17.937 22.75 12 22.75c-1.86 0-3.61-.473-5.137-1.305l-4.74.795a.75.75 0 0 1-.865-.852l.8-5.29A10.7 10.7 0 0 1 1.25 12C1.25 6.063 6.063 1.25 12 1.25M7.943 6.7c-.735 0-1.344.62-1.23 1.386c.216 1.436.854 4.082 2.752 5.994c1.984 1.999 4.823 2.854 6.36 3.191c.796.175 1.475-.455 1.475-1.232v-1.824a.3.3 0 0 0-.192-.28l-1.96-.753a.3.3 0 0 0-.166-.014l-1.977.386c-1.275-.66-2.047-1.4-2.51-2.515l.372-2.015a.3.3 0 0 0-.014-.16l-.735-1.969a.3.3 0 0 0-.28-.195z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Expandable mobile search - shows when search icon is clicked */}
        {isSearchExpanded && (
          <div
            id="header-search-container"
            className="px-4 py-3 bg-white border-t lg:hidden"
          >
            <EnhancedSearchForm
              categories={categories}
              onSearch={handleSearch}
              className="mobile-expanded-search"
              placeholder="Search products..."
              isMobile={true}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default NavHeader;
