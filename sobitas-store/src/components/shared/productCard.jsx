"use client";

import Image from "next/image";
import { Rate } from "antd";
import { ShoppingCart, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formattedPrice";
import { cn } from "@/lib/utils";
import useCartStore from "@/store/cart";
import CountdownTimer from "./countDown";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const ProductCard = ({
  key,
  user,
  product,
  type = "products",
  typeRef = "products",
}) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const isMobile = useIsMobile();

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

  // Check if product is in wishlist on component mount
  useEffect(() => {
    // This would be replaced with actual wishlist check logic
    // For now, just a placeholder
    const checkWishlist = async () => {
      if (user) {
        // Example: const inWishlist = await checkIfInWishlist(user._id, product._id);
        // setIsInWishlist(inWishlist);
      }
    };

    checkWishlist();
  }, [user, product]);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Connexion requise",
        description:
          "Veuillez vous connecter pour ajouter ce produit à votre liste de souhaits.",
        variant: "destructive",
      });
      return;
    }

    // Toggle wishlist state
    setIsInWishlist(!isInWishlist);

    // Here you would add API call to update wishlist in backend
    console.log("Wishlist toggled for product", product?._id);

    toast({
      title: isInWishlist ? "Retiré des favoris" : "Ajouté aux favoris",
      description: isInWishlist
        ? "Le produit a été retiré de votre liste de souhaits."
        : "Le produit a été ajouté à votre liste de souhaits.",
      variant: "default",
    });
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product?.inStock) return;

    addToCart({
      ...product,
      type: type === "pack" ? "Pack" : "Product",
    });

    toast({
      title: "Produit ajouté",
      description: "Le produit a été ajouté à votre panier.",
      variant: "default",
    });
  };

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-white rounded-md overflow-hidden border transition-all duration-300 hover:border-primary/20 hover:shadow-lg group"
      )}
    >
      {type === "pack" && (
        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#A786DF] text-white py-1 px-10 text-xs font-medium shadow-md">
            Pack
          </div>
        </div>
      )}
      {/* Badges */}
      <div className="absolute z-20 space-y-1 text-white top-4 left-4">
        {product?.oldPrice !== 0 && (
          <span className="py-1 px-2 text-xs font-medium bg-[#ef837b] rounded-sm block">
            Promo
          </span>
        )}
        {type === "pack" && (
          <span className="py-1 px-2 text-xs font-medium bg-[#A786DF] rounded-sm block">
            Pack
          </span>
        )}
      </div>
      <Link
        href={`/${typeRef}/${product?.slug}`}
        className="flex flex-col flex-1 h-full"
      >
        {/* Image container - increased height */}
        <div className="relative flex items-center justify-center h-40 p-2 sm:p-4 sm:h-44 md:h-64 bg-gray-50">
          {/* Out of stock banner - centered on image */}
          {!product?.inStock && (
            <div className="absolute inset-0 z-30 flex items-center justify-center">
              <div className="w-full px-4 py-1 text-sm font-medium text-center text-white shadow-md bg-primary md:text-base">
                Rupture de Stock
              </div>
            </div>
          )}

          <div
            className={cn(
              "transition-opacity duration-300 h-full w-full flex items-center justify-center",
              isImageLoaded ? "opacity-100" : "opacity-0",
              !product?.inStock && "opacity-40" // Lower opacity when out of stock
            )}
          >
            <Image
              className={cn(
                "object-contain h-full w-auto max-w-full transition-all duration-300 group-hover:scale-105",
                "mx-auto" // Center the image horizontally
              )}
              src={product?.mainImage?.url.toString() || "/placeholder.svg"}
              alt={product?.designation || "Product image"}
              width={1880}
              height={1040}
              onLoad={() => setIsImageLoaded(true)}
              priority={false}
            />
          </div>
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 rounded-full sm:w-12 sm:h-12 border-primary/30 border-t-primary animate-spin"></div>
            </div>
          )}
        </div>

        {/* Product details - fixed height sections for consistent layout */}
        <div className="flex flex-col flex-1 px-2 pt-4 text-center sm:px-4 sm:pt-6">
          {/* Brand - fixed height */}
          <div className="h-5 mb-1">
            {product?.brand ? (
              <span className="text-xs text-gray-500 uppercase">
                {product.brand}
              </span>
            ) : null}
          </div>

          {/* Product name - fixed height */}
          <div className="h-12 mb-2">
            <h3 className="text-sm font-medium text-center transition-colors sm:text-base line-clamp-2 group-hover:text-primary">
              {product?.designation}
            </h3>
          </div>

          {/* Price section - fixed height */}
          <div className="flex flex-col items-center justify-center h-12 mb-1 md:flex-row md:space-x-2">
            <span className="text-base font-semibold text-[#EF837B]">
              {formatCurrency(product?.price + product?.price * 0.19)}
            </span>
            <div className="flex items-center justify-center h-6">
              {product?.oldPrice !== 0 ? (
                <span className="mt-1 text-sm text-gray-400 line-through">
                  {formatCurrency(product?.oldPrice)}
                </span>
              ) : null}
            </div>
          </div>

          {/* Ratings - fixed height */}
          <div className="flex items-center justify-center ">
            <Rate
              value={averageRating}
              disabled
              allowHalf
              className="text-xs sm:text-sm custom-rate"
            />
            <span className="ml-2 text-xs text-gray-400">({reviewsCount})</span>
          </div>

          {/* Flash sale timer - fixed height container */}
          <div className="flex items-center justify-center h-14">
            {product?.features?.includes("vente-flash") &&
              product?.venteflashDate && (
                <CountdownTimer targetDate={product.venteflashDate} />
              )}
          </div>
        </div>
      </Link>
      {/* Add to cart button  */}
      <div className="absolute bottom-0 left-0 right-0 p-2 transition-transform duration-300 translate-y-full bg-white group-hover:translate-y-0 sm:p-4">
        <Button
          onClick={handleAddToCart}
          disabled={!product?.inStock}
          className={cn(
            "w-full gap-2 transition-all duration-300",
            !product?.inStock
              ? "bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200"
              : "bg-primary hover:bg-primary/90"
          )}
          size="sm"
        >
          <ShoppingCart className="size-4" />
          <span className="text-xs sm:text-sm">
            {product?.inStock ? "Ajouter au panier" : "Indisponible"}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
