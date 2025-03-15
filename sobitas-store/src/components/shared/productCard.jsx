"use client";

import Image from "next/image";
import { Rate } from "antd";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import Link from "next/link";
import { formatCurrency } from "@/lib/formattedPrice";
import { cn } from "@/lib/utils";
import useCartStore from "@/store/cart";
import CountdownTimer from "./countDown";

const ProductCard = ({ user, product, type = "products" }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const [wishlistHover, setWishlistHover] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Calculate reviews count and average rating
  const reviewsCount = product?.reviews?.length || 0;
  const totalRating = product?.reviews?.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  const averageRating =
    reviewsCount > 0
      ? Math.round((totalRating / reviewsCount) * 2) / 2 // Rounds to nearest 0.5
      : 0;

  const handleWishlist = (wishlistProduct) => {
    console.log("wishlist product", wishlistProduct);
    if (user) {
      console.log("user: " + user._id);
    } else {
      alert("Veuillez vous connecter pour ajouter ce produit à votre panier.");
    }
  };

  return (
    <div className="relative flex flex-col h-full bg-white group">
      <Link
        className="cursor-pointer"
        href={`/${type}/${product?.slug}`}
        passHref
      >
        {/* Sale Badge */}
        <div className="space-y-1 absolute top-4 left-4 text-white p-1 text-[13px] z-20">
          {!product?.inStock && (
            <h1
              className={cn("py-[5px] px-[9px] w-fit capitalize bg-[#8C8C8C]")}
            >
              Rupture de Stock
            </h1>
          )}
          {product?.oldPrice !== 0 && (
            <h1
              className={cn("py-[5px] px-[9px] w-fit capitalize bg-[#ef837b]")}
            >
              Promo
            </h1>
          )}
          {type === "pack" && (
            <h1
              className={cn("py-[5px] px-[9px] w-fit capitalize bg-[#A786DF]")}
            >
              Pack
            </h1>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-4 transition-transform duration-300 ease-in-out transform cursor-pointer group-hover:shadow-lg">
        <Link
          href={`/${type}/${product?.slug}`}
          passHref
          className="flex flex-col flex-1"
        >
          {/* Image container */}
          <div className="relative h-64 cursor-pointer">
            <Image
              className="object-contain w-full h-full mx-auto transition-all duration-300 group-hover:scale-110"
              src={product?.mainImage?.url.toString()}
              alt={product?.designation || ""}
              width={240}
              height={240}
            />
          </div>

          {/* Text content */}
          <div className="w-full mt-3 text-center bg-white flex-1 min-h-[120px] flex flex-col">
            <div className="flex-1 pb-6">
              <h6 className="text-[#777777] capitalize text-[13px] mb-2">
                {product?.brand || <br />}
              </h6>
              <h4 className="mb-2 text-base transition-colors duration-200 text-black3 hover:text-primary line-clamp-2">
                {product?.designation}
              </h4>
              <div className="mb-[8px]">
                <span className="text-base text-[#EF837B] mr-2">
                  {formatCurrency(product?.price + product?.price * 0.19)}
                </span>
                {product?.oldPrice !== 0 && (
                  <span className={cn("text-base text-[#CCCCCC] line-through")}>
                    {formatCurrency(product?.oldPrice)}
                  </span>
                )}
              </div>
              <Rate
                value={averageRating}
                disabled
                allowHalf
                className="mr-2 custom-rate"
              />
              <span className="text-[#CCCCCC] text-[13px]">
                ({reviewsCount} {reviewsCount === 1 ? "Review" : "Reviews"})
              </span>
              {/* Timer */}
              <div>
                {product?.features?.includes("vente-flash") &&
                  product?.venteflashDate && (
                    <CountdownTimer targetDate={product.venteflashDate} />
                  )}
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Enhanced Add to Cart and Wishlist Section */}
      <div className="absolute bottom-0 left-0 right-0 z-[99999] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="px-4 pb-4 space-y-3 text-center shadow-lg pointer-events-auto bg-white/90 backdrop-blur-sm">
          <button
            disabled={!product?.inStock}
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className={cn(
              "uppercase w-full text-primary border border-primary group/cart flex items-center justify-center py-2 space-x-2.5 transition-all duration-200 ease-in-out",
              !product?.inStock
                ? "cursor-not-allowed opacity-50 text-gray-400 border-gray-400 hover:bg-gray-400 hover:text-white"
                : "hover:text-white hover:bg-primary"
            )}
          >
            <ShoppingCart
              className={cn(
                "transition-transform duration-200 size-4 group-hover/cart:scale-110"
              )}
              strokeWidth={2}
            />
            <span className="text-center capitalize">
              Ajouter <span className="lowercase">au</span> Panier
            </span>
          </button>

          <div
            onMouseEnter={() => setWishlistHover(true)}
            onMouseLeave={() => setWishlistHover(false)}
            onClick={() => setIsInWishlist(!isInWishlist)}
            className="group/wishlist text-[#666666] text-base cursor-pointer font-light flex items-center justify-center space-x-2 transition-colors duration-200 hover:text-primary"
          >
            <span className="transition-transform duration-200 ease-in-out transform group-hover/wishlist:scale-110">
              {wishlistHover ? (
                <HeartOutlined className="text-primary" />
              ) : isInWishlist ? (
                <HeartFilled className="text-primary" />
              ) : (
                <HeartOutlined />
              )}
            </span>
            <span>
              {isInWishlist
                ? "Remove from Wishlist"
                : "Ajouter à la liste de souhaits"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
