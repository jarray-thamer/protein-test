"use client";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import React, { useEffect, useState } from "react";

import Image from "next/image";

import { getBrands } from "@/services/brands";
import { useRouter } from "next/router";

const BrandSection = () => {
  const [brands, setBrands] = useState([]);
  const [plugin, setPlugin] = React.useState(null);

  useEffect(() => {
    // Initialize plugin after component mounts
    setPlugin(Autoplay({ delay: 1000, stopOnInteraction: false }));
  }, []);

  // Fetch blogs on mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data.data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };
    fetchBrands();
  }, []);

  if (brands.length === 0) {
    return "";
  }

  const handleMouseEnter = () => {
    if (plugin && typeof plugin.stop === "function") {
      plugin.stop();
    }
  };

  const handleMouseLeave = () => {
    if (plugin && typeof plugin.start === "function") {
      plugin.start();
    }
  };

  return (
    <div className="mt-12" id="nos-marques">
      <h3 className="text-[34px] text-center text-black3 uppercase font-bold rubik">
        Nos Marques
      </h3>

      <Carousel
        plugins={[plugin]}
        className="w-[70%] md:w-[80%] lg:w-[90%] mx-auto max-w-screen-2xl my-8"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        key={brands.length} // Force re-init when brands load
      >
        <CarouselContent className="px-4">
          {brands.map((blog) => (
            <CarouselItem
              className="my-auto transition-all duration-200 ease-in sm:basis-1/4 xl:basis-1/6 hover:scale-105"
              key={blog.img_id}
            >
              <div className="p-1 transition-shadow rounded-md group group-hover:shadow-xl ">
                <div className="flex flex-col h-full">
                  <Image
                    src={blog.url}
                    alt={blog.title}
                    width={1080}
                    height={1080}
                    className="object-fill w-full rounded-md"
                    priority
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default BrandSection;
