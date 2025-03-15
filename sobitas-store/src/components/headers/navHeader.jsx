"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlignJustifyIcon, ChevronDownIcon, HeartIcon } from "lucide-react";
import { Input } from "antd";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchOutlined } from "@ant-design/icons";
import CartCounter from "@/components/headers/cartCounter";
import React, { useState } from "react";
import useWishlistStore from "@/store/wishlist";
import useInformationStore from "@/store/information";

export const NavHeader = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [searchInput, setSearchInput] = useState("");
  const { wishlistCount } = useWishlistStore();
  const { information } = useInformationStore();
  const router = useRouter();

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput(""); // Clear search after submission
    }
  };

  // Handle mobile search in drawer
  const handleMobileSearch = () => {
    if (searchInput.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput(""); // Clear search after submission
      setDrawerOpen(false); // Close drawer after search
    }
  };

  return (
    <div className="sticky top-0 z-[9999999] w-full bg-white shadow-lg">
      <div className="flex items-center justify-between px-4 py-6 mx-auto text-black3 max-w-screen-2xl">
        {/*logo and navigations*/}
        <div className="flex items-center space-x-8 text-sm uppercase">
          <Link href="/">
            <Image
              src={information?.general?.logo?.url || "/logo.png"}
              alt={"logo"}
              height={1080}
              width={1440}
              className="h-auto w-44 md:w-[700px] "
            />
          </Link>
          <Link
            className="items-center hidden ml-6 lg:flex hover:text-primary"
            href={"/"}
          >
            <h6>Boutique</h6>
          </Link>
          <Link
            className="items-center hidden ml-6 lg:flex hover:text-primary"
            href={"/promo"}
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
        {/*wishlist search and cart icons*/}
        <div className="flex items-center justify-end w-full space-x-4 lg:space-x-6 text-black3">
          {/* Search input with form handling */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden w-1/2 max-w-md lg:block"
          >
            <Input
              className="w-full"
              placeholder="Search products..."
              value={searchInput}
              onChange={handleSearchInputChange}
              suffix={
                <SearchOutlined
                  className="cursor-pointer"
                  onClick={handleSearchSubmit}
                />
              }
            />
          </form>
          <Link
            href="/wishlist"
            className="items-center justify-center hidden lg:flex"
          >
            <HeartIcon className="mr-[.3rem]" strokeWidth={1.8} size={24} />
            <span className="bg-primary flex items-center justify-center rounded-[50%] min-w-5 h-5 font-normal text-[10px] text-white">
              {wishlistCount || 0}
            </span>
          </Link>
          <CartCounter />
          <Sheet>
            <SheetTrigger>
              <AlignJustifyIcon
                onClick={() => setDrawerOpen(true)}
                className="flex ml-4 cursor-pointer lg:hidden"
                strokeWidth={1.8}
                size={28}
              />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/">
                    <Image
                      src="/logo.png"
                      width={120}
                      height={1080}
                      alt="logo"
                    />
                  </Link>
                </SheetTitle>
                <SheetDescription>
                  {/* Add mobile search in drawer */}
                  <div className="mt-4 mb-6">
                    <Input
                      className="w-full"
                      placeholder="Search products..."
                      value={searchInput}
                      onChange={handleSearchInputChange}
                      suffix={
                        <SearchOutlined
                          className="cursor-pointer"
                          onClick={handleMobileSearch}
                        />
                      }
                      onPressEnter={handleMobileSearch}
                    />
                  </div>
                  <div className="flex flex-col mt-4 space-y-6">
                    <Link
                      href="/"
                      className="uppercase hover:text-primary"
                      onClick={() => setDrawerOpen(false)}
                    >
                      Boutique
                    </Link>
                    <Link
                      href="/products"
                      className="uppercase hover:text-primary"
                      onClick={() => setDrawerOpen(false)}
                    >
                      Promotion
                    </Link>
                    <Link
                      href="/"
                      className="uppercase hover:text-primary"
                      onClick={() => setDrawerOpen(false)}
                    >
                      Marques
                    </Link>
                    <Link
                      href="/"
                      className="uppercase hover:text-primary"
                      onClick={() => setDrawerOpen(false)}
                    >
                      Packs
                    </Link>
                    <Link
                      href="/contact-us"
                      className="uppercase hover:text-primary"
                      onClick={() => setDrawerOpen(false)}
                    >
                      Contact
                    </Link>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default NavHeader;
