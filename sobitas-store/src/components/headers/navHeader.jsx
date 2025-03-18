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
import { Dialog } from "../ui/dialog";

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
    <>
      <div className="sticky z-[99999999999999999999] top-0 w-full bg-white shadow-lg">
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
          {/* search */}
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
          </div>
          <Sheet>
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
              className="z-[999999999999999999999999]"
              onInteractOutside={(e) => e.preventDefault()}
            >
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
                        passHref={link.href}
                        className="uppercase hover:text-primary"
                        onClick={() =>
                          document.dispatchEvent(
                            new KeyboardEvent("keydown", { key: "Escape" })
                          )
                        }
                      >
                        {link.text}
                      </Link>
                    ))}
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default NavHeader;
