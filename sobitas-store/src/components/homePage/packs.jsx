"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "../shared/productCard";
import { useAuth } from "@/context/authContext";
import { getPacks } from "@/services/packs";

const Packs = () => {
  const { user } = useAuth();
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const res = await getPacks();

        setProductsList(res.data.packs || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductList();
  }, []);
  return (
    <div className="flex flex-col w-full mx-auto mt-24 space-y-5 max-w-screen-2xl">
      <h2 className="text-4xl font-bold text-center uppercase text-black3">
        Packs
      </h2>
      {/* <div className="flex gap-4 mx-auto uppercase">
        <p
          onClick={() => handleSetFilter("all")}
          className={cn(
            "px-2 py-1 transition-all duration-500  cursor-pointer",
            selectedFilter === "all"
              ? "text-white bg-primary"
              : "text-[#777777] hover:text-primary"
          )}
        >
          ALL
        </p>
        <p
          onClick={() => handleSetFilter("creatine")}
          className={cn(
            "px-2 py-1 transition-all duration-500  cursor-pointer",
            selectedFilter === "creatine"
              ? "text-white bg-primary"
              : "text-[#777777] hover:text-primary"
          )}
        >
          Creatine
        </p>
        <p
          onClick={() => handleSetFilter("protein")}
          className={cn(
            "px-2 py-1 transition-all duration-500  cursor-pointer",
            selectedFilter === "protein"
              ? "text-white bg-primary"
              : "text-[#777777] hover:text-primary"
          )}
        >
          Protein
        </p>
        <p
          onClick={() => handleSetFilter("pre-workout")}
          className={cn(
            "px-2 py-1 transition-all duration-500  cursor-pointer",
            selectedFilter === "pre-workout"
              ? "text-white bg-primary"
              : "text-[#777777] hover:text-primary"
          )}
        >
          Pre-workout
        </p>
      </div> */}
      <div className="grid grid-cols-1 gap-6 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {productsList.map((product, idx) => {
          return (
            <ProductCard type="pack" key={idx} user={user} product={product} />
          );
        })}
      </div>
      <button className="px-12 py-3 mx-auto text-sm uppercase transition-all duration-300 border mt-14 w-fit hover:text-white hover:bg-primary">
        View more Packs <span className="ml-2">→</span>
      </button>
    </div>
  );
};

export default Packs;
