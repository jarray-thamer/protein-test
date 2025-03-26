"use client";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/authContext";
import { cn } from "@/lib/utils";
import useCartStore from "@/store/cart";
import { HeartOutlined } from "@ant-design/icons";
import { Rate } from "antd";
import {
  HeartIcon,
  PackageCheckIcon,
  PackageXIcon,
  ShoppingCartIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/shared/productCard";
import CountdownTimer from "./countDown";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useInformationStore from "@/store/information";

const ProductDetail = ({ item, relatedItems, type }) => {
  const { information } = useInformationStore();

  const [selectedImage, setSelectedImage] = useState(item.mainImage);
  const thumbnailRef = useRef(null);
  const images = [item.mainImage, ...(item.images || [])];
  const isPack = item.products;
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectDescription, setSelectDescription] = useState(1);
  const { user } = useAuth();

  // Variant handling
  const [availableVariants, setAvailableVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    // Initialize variants
    if (item?.variant?.length > 0) {
      const variants = item.variant.map((v) => ({
        ...v,
        inStock: v.inStock,
      }));
      setAvailableVariants(variants);
      // Auto-select first available variant
      const firstInStock = variants.find((v) => v.inStock);
      setSelectedVariant(firstInStock || variants[0]);
    }
  }, [item]);

  // Scroll handlers
  const scrollThumbnails = (direction) => {
    const container = thumbnailRef.current;
    if (!container) return;
    const scrollAmount = direction === "next" ? 100 : -100;
    window.innerWidth < 768
      ? (container.scrollLeft += scrollAmount)
      : (container.scrollTop += scrollAmount);
  };

  // Handlers
  const handleVariantSelect = (variant) => {
    if (variant.inStock) setSelectedVariant(variant);
  };

  const handleDecrement = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrement = () => setQuantity(quantity + 1);

  // Calculate rating
  const reviews = item.reviews || [];
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0;

  // Price display
  const currentPrice = item.price;
  const oldPrice = item.oldPrice;

  // Add to cart handler
  const handleAddToCart = () => {
    const productToAdd = {
      ...item,
      type: type === "pack" ? "Pack" : "Product", // Add type information
      quantity: quantity,
      selectedVariant: item?.variant?.length > 0 ? selectedVariant : null,
      price: selectedVariant?.price || item.price,
    };

    addToCart(productToAdd);
  };

  return (
    <div className="flex flex-col justify-center w-full px-4 pt-4 mx-auto md:px-8 max-w-screen-2xl">
      {/* Product header */}
      <div className="flex flex-col justify-center gap-4 md:flex-row md:gap-6">
        {/* Enhanced Images section */}
        <div className="relative flex flex-col-reverse md:flex-row group">
          {/* Thumbnails Carousel */}
          <div className="relative flex flex-col mt-4 md:mt-0 md:h-[420px]">
            {/* Mobile left/right arrows */}
            <div className="relative flex items-center md:hidden">
              {images.length > 3 && (
                <>
                  <button
                    onClick={() => scrollThumbnails("prev")}
                    className="absolute left-0 z-10 flex items-center justify-center w-8 h-8 bg-white border rounded-full shadow-md hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => scrollThumbnails("next")}
                    className="absolute right-0 z-10 flex items-center justify-center w-8 h-8 bg-white border rounded-full shadow-md hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Desktop up/down arrows */}
            {images.length > 4 && (
              <>
                <button
                  onClick={() => scrollThumbnails("prev")}
                  className="absolute left-0 right-0 z-10 items-center justify-center hidden w-8 h-8 mx-auto bg-white border rounded-full shadow-md md:flex -top-4 hover:bg-gray-50"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>

                <button
                  onClick={() => scrollThumbnails("next")}
                  className="absolute left-0 right-0 z-10 items-center justify-center hidden w-8 h-8 mx-auto bg-white border rounded-full shadow-md md:flex -bottom-4 hover:bg-gray-50"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Thumbnail Container */}
            <div
              ref={thumbnailRef}
              className="flex flex-row gap-4 py-4 my-2 overflow-x-auto md:flex-col md:py-0 md:my-0 md:gap-4 md:overflow-y-auto md:max-h-[420px] md:h-full"
              style={{
                scrollBehavior: "smooth",
                scrollbarWidth: "none" /* Firefox */,
              }}
            >
              {/* Hide scrollbar for Chrome, Safari and Opera */}
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    "relative cursor-pointer border-2 transition-all duration-200 hover:border-primary min-w-[80px] md:min-w-[96px] flex-shrink-0",
                    selectedImage.url === img.url
                      ? "border-primary"
                      : "border-transparent"
                  )}
                >
                  <div className="relative w-20 h-20 overflow-hidden md:w-24 md:h-24">
                    <Image
                      src={img.url}
                      alt={item.designation}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Image Preview - Enhanced for perfect square aspect ratio */}
          <div className="relative w-full md:w-[420px] md:h-[420px] aspect-square mx-2">
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={selectedImage.url}
                alt={item.designation}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 420px"
              />
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className="flex flex-col justify-between w-full md:w-fit">
          <div>
            <div className="flex flex-col items-start justify-between space-y-2 md:flex-row">
              <h1 className="mb-1 text-3xl font-bold">{item.designation}</h1>
              <h1>
                {item?.inStock ? (
                  <p className="flex items-center space-x-2 text-green-500">
                    <PackageCheckIcon /> <span>En Stock</span>
                  </p>
                ) : (
                  <p className="flex items-center space-x-2 text-red-500">
                    <PackageXIcon /> <span>Repture de Stock</span>
                  </p>
                )}
              </h1>
            </div>
            <p className="text-xl font-medium capitalize">{item?.brand}</p>
            <div className="flex items-center">
              <Rate value={averageRating} disabled allowHalf className="mr-2" />
              <span className="text-[#cccccc]">({reviews.length} Reviews)</span>
            </div>
            <div className="flex items-center justify-start gap-4 mt-2">
              <h6 className="text-3xl font-semibold text-primary">
                {(
                  currentPrice +
                  currentPrice * information?.advanced?.tva
                ).toFixed(3)}{" "}
                TND
              </h6>
              {oldPrice ? (
                <span className="text-lg line-through text-muted-foreground">
                  {oldPrice.toFixed(3)} TND
                </span>
              ) : (
                ""
              )}
            </div>
            {item.venteflashDate && (
              <CountdownTimer targetDate={item.venteflashDate} />
            )}
            <p className="my-2 text-sm text-slate-600">
              {item?.smallDescription}
            </p>

            {/* Pack specific info */}
            {isPack && (
              <div className="mt-4">
                <h4 className="font-semibold">Dans le Pack:</h4>
                <ul className="pl-4 list-disc">
                  {item.products.map((product, i) => (
                    <li key={i}>{product}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gout/Variant Buttons */}
            {availableVariants.length > 0 && (
              <div className="flex flex-col mt-1">
                <p className="mb-2 text-[#666666]">Gout:</p>
                <div className="flex flex-wrap gap-2">
                  {availableVariants.map((variant, i) => (
                    <button
                      key={i}
                      onClick={() => handleVariantSelect(variant)}
                      disabled={!variant.inStock}
                      className={cn(
                        "px-6 py-2 border rounded-lg text-md transition-all duration-200",
                        !variant.inStock && "opacity-50 cursor-not-allowed",
                        selectedVariant?.title === variant.title
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 hover:border-primary"
                      )}
                    >
                      {variant.title}
                      {!variant.inStock && " (Repture de Stock)"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <Separator className="mt-2" />
            {/* Quantity and Add to Cart */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <QuantityInput
                quantity={quantity}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onChange={setQuantity}
              />

              <button
                onClick={handleAddToCart}
                disabled={!item?.inStock}
                className={cn(
                  "flex items-center justify-center px-6 py-2 border font-bold text-xl uppercase rounded-lg w-full md:w-2/3 border-primary hover:bg-white hover:text-primary bg-primary text-black text-center transition-all duration-200",
                  !item?.inStock &&
                    "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-primary"
                )}
              >
                <ShoppingCartIcon strokeWidth={2} className="mr-2 size-6" />
                <span>Acheter</span>
              </button>

              {/* <WishlistButton item={item} /> */}
            </div>

            {/* Categories */}
            {!isPack && item.category && (
              <div className="mt-4">
                <CategoryLinks type item={item} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <DetailTabs
        item={item}
        selectDescription={selectDescription}
        setSelectDescription={setSelectDescription}
      />

      {/* Related items */}
      {relatedItems && (
        <div className="mt-12">
          <h3 className="mb-8 text-2xl font-semibold text-center">
            You May Also Like
          </h3>
          <div className="grid grid-cols-2 gap-4 px-4 mx-auto mt-12 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-8 max-w-screen-2xl">
            {relatedItems.slice(0, 4).map((item, i) => (
              <ProductCard
                typeRef="packs"
                type={type}
                key={i}
                user={user}
                product={item}
              />
            ))}
          </div>
        </div>
      )}
      {/* Bottom sticky add to cart section */}
    </div>
  );
};

// Sub-components
const QuantityInput = ({ quantity, onIncrement, onDecrement, onChange }) => (
  <div className="flex items-center border border-gray-300 rounded-lg">
    <button onClick={onDecrement} className="px-3 py-2">
      -
    </button>
    <div className="relative">
      <input
        type="number"
        value={quantity}
        onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-16 px-3 py-2 text-center text-gray-700 bg-white appearance-none focus:outline-none"
        min="1"
        style={{
          "-MozAppearance": "textfield",
          "-webkit-appearance": "textfield",
          appearance: "textfield",
        }}
      />
      <style jsx>{`
        /* Hide the default up/down arrows */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          mozappearance: textfield;
        }
      `}</style>
    </div>
    <button onClick={onIncrement} className="px-3 py-2">
      +
    </button>
  </div>
);

const WishlistButton = ({ item }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <button
      onClick={() => setIsLiked(!isLiked)}
      className="flex items-center gap-2 hover:text-primary"
    >
      {isLiked ? <HeartIcon fill="currentColor" /> : <HeartOutlined />}
      <span>
        {isLiked ? "Remove Wishlist" : "Ajouter à la liste de souhaits"}
      </span>
    </button>
  );
};

const CategoryLinks = ({ item, type = "products" }) => (
  <div className="mt-4">
    Category:{" "}
    <Link
      href={`/products?category=${item.category.designation}`}
      className="capitalize text-primary"
    >
      {item.category.designation.toLowerCase()}
    </Link>
  </div>
);

const DetailTabs = ({ item, selectDescription, setSelectDescription }) => {
  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="mt-12">
      <div className="flex flex-wrap justify-center gap-x-8 md:gap-x-32">
        {["Description", "Caracteristiques", "Reviews", "Question"].map(
          (tab, i) => (
            <button
              key={tab}
              onClick={() => setSelectDescription(i + 1)}
              className={cn(
                "pb-4 border-b-2 mb-2",
                selectDescription === i + 1
                  ? "border-primary text-primary"
                  : "border-transparent hover:text-primary"
              )}
            >
              {tab} {tab === "Reviews" && `(${item.reviews?.length || 0})`}
            </button>
          )
        )}
      </div>

      <div className="p-6 border">
        <AnimatePresence mode="wait">
          {selectDescription === 1 && (
            <motion.div key="desc" variants={fadeVariants}>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </motion.div>
          )}

          {selectDescription === 2 && (
            <motion.div key="Caracteristiques" variants={fadeVariants}>
              {item.nutritionalValues && (
                <div className="mt-4">
                  <h4 className="font-semibold">Caracteristiques</h4>
                  <ul className="pl-6 list-disc">
                    {item.nutritionalValues.map((nv, i) => (
                      <li key={i}>
                        {nv.title}: {nv.value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {selectDescription === 3 && (
            <motion.div key="reviews" variants={fadeVariants}>
              {item.reviews?.map((review, i) => (
                <div key={i} className="py-4 border-b">
                  <Rate value={review.rating} disabled />
                  <p className="mt-2">{review.comment}</p>
                  <p className="text-sm text-muted-foreground">
                    - {review.userName}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
          {selectDescription === 4 && (
            <motion.div key="question" variants={fadeVariants}>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: item.question }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductDetail;
