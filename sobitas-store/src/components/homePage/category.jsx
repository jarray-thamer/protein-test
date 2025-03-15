"use client";

import Image from "next/image";

const CategorySection = () => {
  const categories = [
    {
      title: "ÉQUIPEMENTS ET ACCESSOIRES SPORTIFS",
      img: "/categoryIcons/icon1.jpg",
      href: `/products?category=${encodeURIComponent(
        "EQUIPEMENTS ET ACCESSOIRES SPORTIFS"
      )}`,
    },
    {
      title: "COMPLÉMENTS ALIMENTAIRES",
      img: "/categoryIcons/icon2.jpg",
      href: "/products?category=COMPLÉMENTS ALIMENTAIRES",
    },
    {
      title: "COMPLÉMENTS D'ENTRAÎNEMENT",
      img: "/categoryIcons/icon3.jpg",
      href: "/products?category=COMPLÉMENTS D'ENTRAÎNEMENT",
    },
    {
      title: "PERTE DE POIDS",
      img: "/categoryIcons/icon4.jpg",
      href: "/products?category=",
    },
    {
      title: "PROTÉINES",
      img: "/categoryIcons/icon5.jpg",
      href: "/products?category=",
    },
    {
      title: "PRISE DE MASSE",
      img: "/categoryIcons/icon6.jpg",
      href: "/products?category=",
    },
  ];

  return (
    <div className="px-4 mt-12 md:px-8 lg:px-12">
      <h1 className="text-[34px] text-center text-black3 uppercase font-bold rubik mb-8">
        Nos Categories
      </h1>

      <div className="grid max-w-5xl grid-cols-2 gap-4 mx-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((category, index) => (
          <a
            key={index}
            href={category.href}
            className="flex flex-col items-center group"
          >
            <Image
              width={1080}
              height={1080}
              src={category.img}
              alt={category.title}
              className="relative flex items-center justify-center object-cover object-center w-24 mb-2 overflow-hidden transition-transform duration-300 border border-gray-200 rounded-full sm:w-20 sm:h-20 md:w-20 md:h-20 group-hover:scale-105 bg-gray-50"
            />

            <h3 className="text-xs font-medium text-center capitalize sm:text-sm">
              {category.title.toLowerCase()}
            </h3>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
