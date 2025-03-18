"use client";
import { getSlides } from "@/services/information";
import { Carousel } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";

const HeroSectionCarousel = () => {
  const [slides, setSlides] = useState([]);
  useEffect(() => {
    const fetchSlides = async () => {
      const res = await getSlides();

      setSlides(res.data);
    };
    fetchSlides();
  }, []);
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 2000,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Carousel
      id="top"
      className="w-full h-[400px] md:h-screen"
      arrows
      {...carouselSettings}
    >
      {slides.map((slide, index) => (
        <div key={`slide-${index}`} className="relative h-full">
          <Image
            src={slide.url}
            alt={slide.img_id}
            width={1440}
            height={1080}
            priority={index < 2} // Prioritize first two slides
            loading={index < 2 ? "eager" : "lazy"}
            placeholder="blur"
            onError={() => handleImageError(slide.src)}
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
            className="object-fill w-full h-[400px] md:h-screen"
          />
          {/* Optional slide indicators */}
          <div className="absolute px-2 py-1 text-white bg-black bg-opacity-50 rounded bottom-4 right-4">
            {index + 1} / {slides.length}
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default HeroSectionCarousel;
