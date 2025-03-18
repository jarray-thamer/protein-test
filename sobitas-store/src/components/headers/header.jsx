"use client";

import TopHeader from "@/components/headers/topHeader";
import { PhoneIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import NavHeader from "@/components/headers/navHeader";
import { useIsLoggedIn } from "@/store/authStore";

export const headers = ({ information }) => {
  const isLoggedIn = useIsLoggedIn();
  return (
    <>
      <TopHeader />
      <div className="flex flex-col w-full mx-auto max-w-screen-2xl">
        <div className="hidden font-light sm:flex justify-end items-center text-[#777777] text-[14px] 2xl:text-base uppercase py-2 space-x-6 px-4 ">
          <Link
            href="/"
            className="flex items-center space-x-1 hover:text-primary"
          >
            <PhoneIcon
              size={6}
              strokeWidth={1.8}
              className="size-[12px] 2xl:size-[13px]"
            />
            <h6>CALL: {information?.general?.contact?.fax}</h6>
          </Link>
          <Link href="/contact-us" className="hover:text-primary">
            contact us
          </Link>
          {!isLoggedIn ? (
            <Link
              href={`/auth/login`}
              className="flex items-center justify-center space-x-1 hover:text-primary"
            >
              <UserRoundIcon
                size={6}
                strokeWidth={2}
                className="size-[14px] 2xl:size-[16px] m-0 p-0"
              />
              <span>login</span>
            </Link>
          ) : (
            <Link
              href={`/auth/profile`}
              className="flex items-center justify-center space-x-1 hover:text-primary"
            >
              <UserRoundIcon
                size={6}
                strokeWidth={2}
                className="size-[14px] 2xl:size-[16px] m-0 p-0"
              />
              <span>Profile</span>
            </Link>
          )}
        </div>
        <Separator />
      </div>
      <NavHeader />
    </>
  );
};

export default headers;
