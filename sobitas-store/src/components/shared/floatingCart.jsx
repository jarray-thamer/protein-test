"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingCartIcon, PlusIcon, MinusIcon, XIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import useCartStore from "@/store/cart";
import useInformationStore from "@/store/information";

const FloatingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    cart,
    initializeCart,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    getUniqueId,
    getCartTotal,
    getItemCount,
    calculatePriceWithTVA,
    getCartTotalWithTVA,
  } = useCartStore();

  // Get information store to access TVA rate
  const { information } = useInformationStore();

  // Get TVA rate with fallback to 0 if not available
  const tvaRate = information?.advanced?.tva || 0;

  // Initialize cart from localStorage on component mount
  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  // Get cart totals using the store's helper functions
  const cartTotalWithTVA = getCartTotalWithTVA(tvaRate);
  const cartSubtotal = getCartTotal();
  const itemCount = getItemCount();
  const tvaTotalAmount = cartTotalWithTVA - cartSubtotal;

  // Format price to display with 2 decimal places
  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  return (
    <div className="fixed z-[99999999] bottom-6 right-6">
      {/* Main Cart Button */}
      <button
        onClick={toggleCart}
        className="relative flex items-center justify-center w-16 h-16 text-white transition-all duration-300 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        aria-label="Shopping Cart"
      >
        <ShoppingCartIcon size={24} />
        {itemCount > 0 && (
          <span className="absolute flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full -top-2 -right-2">
            {itemCount}
          </span>
        )}
      </button>

      {/* Cart Panel - Wider version */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 overflow-hidden bg-white rounded-lg shadow-xl bottom-20 w-96"
          >
            <div className="flex items-center justify-between p-4 font-medium text-white bg-primary">
              <h3>Your Cart ({itemCount} items)</h3>
              <button
                onClick={toggleCart}
                className="text-white hover:text-gray-200"
              >
                <XIcon size={18} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-96">
              {cart.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Your cart is empty
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {cart.map((item) => {
                    const itemPriceWithTVA =
                      calculatePriceWithTVA(item, tvaRate) / item.quantity;
                    return (
                      <li key={getUniqueId(item)} className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-20 h-20 overflow-hidden bg-gray-100 rounded-md">
                            <Image
                              src={
                                item.mainImage?.url || "/api/placeholder/80/80"
                              }
                              alt={item.designation}
                              width={80}
                              height={80}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.designation}
                            </p>
                            {item.selectedVariant && (
                              <p className="text-xs text-gray-600">
                                {item.selectedVariant.title}
                              </p>
                            )}
                            <p className="text-sm text-gray-500">
                              $ {formatPrice(itemPriceWithTVA)}
                              {item.oldPrice && (
                                <span className="ml-2 text-xs text-gray-400 line-through">
                                  ${item.oldPrice.toFixed(2)}
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                decreaseQuantity(getUniqueId(item))
                              }
                              className="p-1 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                              aria-label="Decrease quantity"
                            >
                              <MinusIcon size={14} />
                            </button>
                            <span className="w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                addToCart({ ...item, quantity: 1 })
                              }
                              className="p-1 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                              aria-label="Increase quantity"
                            >
                              <PlusIcon size={14} />
                            </button>
                            <button
                              onClick={() => removeFromCart(getUniqueId(item))}
                              className="p-1 ml-1 text-red-600 bg-red-100 rounded-md hover:bg-red-200"
                              aria-label="Remove item"
                            >
                              <XIcon size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-right text-gray-700">
                          Total: $
                          {formatPrice(calculatePriceWithTVA(item, tvaRate))}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between py-1 mb-1 text-lg font-bold">
                  <span className="text-gray-800">Total:</span>
                  <span className="text-primary">
                    ${formatPrice(cartTotalWithTVA)}
                  </span>
                </div>
                <div className="flex justify-between py-1 mb-4 text-sm">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{itemCount}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={toggleCart}
                    className="px-4 py-2 transition-colors border rounded-md text-primary border-primary hover:bg-primary/10"
                  >
                    Continue Shopping
                  </button>
                  <button className="px-4 py-2 text-white transition-colors rounded-md bg-primary hover:bg-primary/90">
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingCart;
