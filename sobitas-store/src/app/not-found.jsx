import Footer from "@/components/footer/footer";
import Header from "@/components/headers/header";
import Image from "next/image";
import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col h-screen min-h-screen">
      {/* This will make the page take full height */}
      <Header />
      <div className="relative flex-grow w-full h-full">
        {/* Content area takes remaining space */}
        <div className="relative w-full h-full">
          {/* Full screen section */}
          {/* Container for the background image */}
          <div className="relative w-full h-full overflow-hidden">
            <div className="relative w-full h-[60vh]  md:h-full">
              {/* Container for the background image with responsive height */}
              <Image
                src="https://portotheme.com/html/molla/assets/images/backgrounds/error-bg.jpg"
                alt="Contact Us"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          {/* Overlay content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-screen-xl mx-auto space-y-6">
              <h1 className="text-6xl font-semibold text-center text-black3 ">
                Error 404
              </h1>
              <p className="text-base font-light text-center text-[#777777] ">
                We are sorry, the page you've requested is not available.
              </p>
              <button className="uppercase w-fit mx-auto px-8 text-center border text-primary border-primary flex items-center justify-center py-2 space-x-2.5 transition-all duration-200 ease-in-out hover:text-white hover:bg-primary">
                Back to homepage →
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
