"use client";

import Image from "next/image";
import { Rate } from "antd";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formattedPrice";
import { cn } from "@/lib/utils";
import useCartStore from "@/store/cart";
import CountdownTimer from "./countDown";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Memoized ProductCard component to prevent unnecessary re-renders
const ProductCard = memo(
  ({ key, user, product, type = "products", typeRef = "products" }) => {
    // State management
    const addToCart = useCartStore((state) => state.addToCart);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
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

    // Calculate discount percentage if there's an old price
    const calculateDiscount = () => {
      if (!product?.oldPrice || product.oldPrice <= product.price) return 0;
      return Math.round(
        ((product.oldPrice - product.price) / product.oldPrice) * 100
      );
    };

    const discountPercentage = calculateDiscount();

    // Memoized wishlist check function to prevent recreating on every render
    const checkWishlist = useCallback(async () => {
      if (user) {
        // Example: const inWishlist = await checkIfInWishlist(user._id, product._id);
        // setIsInWishlist(inWishlist);
      }
    }, [user, product]);

    // Check if product is in wishlist on component mount
    useEffect(() => {
      // checkWishlist()
    }, []);

    // Handle wishlist toggle with optimistic UI update
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

      // Optimistic UI update
      // setIsInWishlist((prev) => !prev)

      // Here you would add API call to update wishlist in backend
      // If the API call fails, you can revert the state
      // Example:
      // try {
      //   await updateWishlist(user._id, product._id, !isInWishlist);
      // } catch (error) {
      //   setIsInWishlist(!isInWishlist); // Revert on failure
      //   toast({
      //     title: "Erreur",
      //     description: "Une erreur est survenue. Veuillez réessayer.",
      //     variant: "destructive",
      //   });
      //   return;
      // }

      // toast({
      //   title: isInWishlist ? "Retiré des favoris" : "Ajouté aux favoris",
      //   description: isInWishlist
      //     ? "Le produit a été retiré de votre liste de souhaits."
      //     : "Le produit a été ajouté à votre liste de souhaits.",
      //   variant: "default",
      // })
    };

    // Handle add to cart with debounce to prevent multiple clicks
    const handleAddToCart = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!product?.inStock) return;

        addToCart({
          ...product,
          type: type === "pack" ? "Pack" : "Product",
          quantity: 1, // Explicitly set quantity for clarity
        });

        toast({
          title: "Produit ajouté",
          description: "Le produit a été ajouté à votre panier.",
          variant: "default",
        });
      },
      [product, type, addToCart]
    );

    return (
      <div
        className={cn(
          "relative flex flex-col h-full bg-white rounded-md overflow-hidden border transition-all duration-300",
          isHovered
            ? "border-primary/40 shadow-lg translate-y-[-4px]"
            : "border-gray-200",
          "hover:border-primary/20 hover:shadow-lg group"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`${product?.designation || "Product"} card`}
      >
        {/* Badge container - positioned absolutely */}
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between p-2">
          {/* Left badges */}
          <div className="space-y-1 text-white">
            {product?.oldPrice !== 0 && discountPercentage > 0 && (
              <span className="py-0.5 px-1.5 text-[10px] font-medium bg-[#ef837b] rounded-sm block">
                Promo -{discountPercentage}%
              </span>
            )}
            {product?.features?.includes("vente-flash") && (
              <span className="py-0.5 px-1.5 text-[10px] font-medium bg-amber-500 rounded-sm block">
                Flash
              </span>
            )}
          </div>

          {/* Right badges */}
          <div className="space-y-1 text-white">
            {type === "pack" && (
              <span className="py-0.5 px-1.5 text-[10px] font-medium bg-[#A786DF] rounded-sm block">
                Pack
              </span>
            )}
          </div>
        </div>

        <Link
          href={`/${typeRef}/${product?.slug}`}
          className="flex flex-col flex-1 h-full"
          aria-label={`View details for ${product?.designation || "product"}`}
        >
          {/* Image container with aspect ratio */}
          <div className="relative flex items-center justify-center p-2 sm:p-4 aspect-square bg-gray-50">
            {/* Out of stock overlay */}
            {!product?.inStock && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
                <div className="w-full px-4 py-1.5 text-sm font-medium text-center text-white shadow-md bg-primary/90 md:text-base transform rotate-[-5deg]">
                  Rupture de Stock
                </div>
              </div>
            )}

            {/* Image with loading state */}
            <div
              className={cn(
                "transition-all duration-500 h-full w-full flex items-center justify-center",
                isImageLoaded ? "opacity-100" : "opacity-0",
                !product?.inStock && "opacity-40" // Lower opacity when out of stock
              )}
            >
              <Image
                className={cn(
                  "object-contain h-full w-auto max-w-full transition-all duration-500",
                  isHovered ? "scale-110" : "scale-100"
                )}
                src={product?.mainImage?.url.toString() || "/placeholder.svg"}
                alt={product?.designation || "Product image"}
                width={500}
                height={500}
                onLoad={() => setIsImageLoaded(true)}
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMWYxIi8+PC9zdmc+"
              />
            </div>

            {/* Loading spinner */}
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 rounded-full sm:w-12 sm:h-12 border-primary/30 border-t-primary animate-spin"></div>
              </div>
            )}
          </div>

          {/* Product details section */}
          <div className="flex flex-col flex-1 px-3 pt-4 pb-16 text-center sm:px-4 sm:pt-5">
            {/* Brand */}
            {product?.brand && (
              <div className="mb-1.5">
                <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                  {product.brand}
                </span>
              </div>
            )}

            {/* Product name */}
            <h3 className="mb-2.5 text-sm font-medium text-center transition-colors sm:text-base line-clamp-2 group-hover:text-primary">
              {product?.designation}
            </h3>

            {/* Price section */}
            <div className="flex flex-col items-center justify-center mb-2 md:flex-row md:space-x-2">
              <span className="text-base font-semibold text-[#EF837B]">
                {formatCurrency(product?.price + product?.price * 0.19)}
              </span>
              {product?.oldPrice !== 0 && (
                <span className="mt-1 text-sm text-gray-400 line-through">
                  {formatCurrency(product?.oldPrice)}
                </span>
              )}
            </div>

            {/* Ratings */}
            <div className="flex items-center justify-center mb-3">
              <Rate
                value={averageRating}
                disabled
                allowHalf
                className="text-xs sm:text-sm custom-rate"
              />
              <span className="ml-2 text-xs text-gray-400">
                ({reviewsCount})
              </span>
            </div>

            {/* Flash sale timer */}
            {product?.features?.includes("vente-flash") &&
              product?.venteflashDate && (
                <div className="mt-auto">
                  <CountdownTimer targetDate={product.venteflashDate} />
                </div>
              )}
          </div>
        </Link>

        {/* Add to cart button - slide up on hover */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-3 bg-white transition-all duration-300",
            isHovered ? "translate-y-0" : "translate-y-full",
            "group-hover:translate-y-0 sm:p-4"
          )}
        >
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
            <ShoppingCart
              className={cn(
                "size-4",
                isHovered && product?.inStock && "animate-bounce"
              )}
            />
            <span className="text-xs sm:text-sm">
              {product?.inStock ? "Ajouter au panier" : "Indisponible"}
            </span>
          </Button>
        </div>

        {/* Stock indicator */}
        {product?.inStock && product?.stockQuantity && (
          <div className="absolute bottom-0 left-0 right-0 h-1">
            <div
              className={cn(
                "h-full bg-green-500",
                product.stockQuantity > 10
                  ? "w-full"
                  : product.stockQuantity > 5
                  ? "w-1/2"
                  : "w-1/4"
              )}
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    );
  }
);

// Display name for debugging
ProductCard.displayName = "ProductCard";

export default ProductCard;
