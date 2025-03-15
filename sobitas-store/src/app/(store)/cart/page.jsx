"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  XIcon,
  ArrowRightIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import useCartStore from "@/store/cart";
import useInformationStore from "@/store/information";

export default function ViewCartPage() {
  const router = useRouter();
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
    clearCart,
  } = useCartStore();

  // Get information store to access TVA rate
  const { information, initInformation } = useInformationStore();

  // Initialize cart from localStorage and fetch information on component mount
  useEffect(() => {
    initializeCart();
    initInformation();
  }, [initializeCart, initInformation]);

  // Get TVA rate with fallback to 0 if not available
  const tvaRate = information?.advanced?.tva || 0;

  // Get cart totals using the store's helper functions
  const cartTotalWithTVA = getCartTotalWithTVA(tvaRate);
  const cartSubtotal = getCartTotal();
  const itemCount = getItemCount();
  const tvaTotalAmount = cartTotalWithTVA - cartSubtotal;

  // Format price to display with 2 decimal places
  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "0.00";
    }
    return Number(price).toFixed(2);
  };

  // Handle checkout button click
  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="flex items-center gap-2 mb-8 text-2xl font-bold">
        <ShoppingCartIcon className="text-primary" />
        Votre Panier
      </h1>

      {cart.length === 0 ? (
        <div className="py-16 text-center rounded-lg bg-gray-50">
          <ShoppingCartIcon size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className="mb-2 text-xl font-medium text-gray-600">
            Votre panier est vide
          </h2>
          <p className="mb-6 text-gray-500">
            Vous n'avez pas encore ajouté de produits à votre panier.
          </p>
          <button
            onClick={() => router.push("/products")}
            className="uppercase w-fit px-16 text-primary border border-primary group/cart flex items-center justify-center py-2 space-x-2.5 transition-all duration-300 ease-in hover:text-white hover:bg-primary"
          >
            <span className="text-center">Continuer vos achats</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Articles ({itemCount})</h2>
              </div>
              <ul className="divide-y divide-gray-100">
                {cart.map((item) => {
                  const itemPriceWithTVA = calculatePriceWithTVA(item, tvaRate);
                  const itemUnitPrice = item.price * (1 + tvaRate);
                  return (
                    <li key={getUniqueId(item)} className="p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex-shrink-0 w-24 h-24 overflow-hidden bg-gray-100 rounded-md">
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
                          <p className="mb-1 text-base font-medium text-gray-900">
                            {item.designation}
                          </p>
                          {item.selectedVariant && (
                            <p className="mb-1 text-sm text-gray-600">
                              Variante: {item.selectedVariant.title}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            Prix unitaire: {formatPrice(itemUnitPrice)} TND
                            {item.oldPrice && (
                              <span className="ml-2 text-xs text-gray-400 line-through">
                                {formatPrice(item.oldPrice)} TND
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center mt-2 space-x-2 sm:mt-0">
                          <button
                            onClick={() => decreaseQuantity(getUniqueId(item))}
                            className="p-1 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            aria-label="Diminuer la quantité"
                          >
                            <MinusIcon size={16} />
                          </button>
                          <span className="w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => addToCart({ ...item, quantity: 1 })}
                            className="p-1 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            aria-label="Augmenter la quantité"
                          >
                            <PlusIcon size={16} />
                          </button>
                          <button
                            onClick={() => removeFromCart(getUniqueId(item))}
                            className="p-1 ml-2 text-red-600 bg-red-100 rounded-md hover:bg-red-200"
                            aria-label="Supprimer l'article"
                          >
                            <XIcon size={16} />
                          </button>
                        </div>
                        <div className="font-medium text-right">
                          {formatPrice(itemPriceWithTVA)} TND
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="flex justify-between p-4 border-t">
                <button
                  onClick={() => router.push("/products")}
                  className="uppercase w-fit px-6 text-primary border border-primary flex items-center justify-center py-2 space-x-2.5 transition-all duration-300 ease-in hover:text-white hover:bg-primary"
                >
                  <span className="text-center">Continuer vos achats</span>
                </button>
                <button
                  onClick={clearCart}
                  className="uppercase w-fit px-6 text-red-500 border border-red-500 flex items-center justify-center py-2 space-x-2.5 transition-all duration-300 ease-in hover:text-white hover:bg-red-500"
                >
                  <span className="text-center">Vider le panier</span>
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-lg font-medium">Récapitulatif</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span>{formatPrice(cartSubtotal)} TND</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    TVA ({(tvaRate * 100).toFixed(1)}%)
                  </span>
                  <span>{formatPrice(tvaTotalAmount)} TND</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatPrice(cartTotalWithTVA)} TND
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full mt-4 uppercase px-16 text-white bg-primary group/cart flex items-center justify-center py-2 space-x-2.5 transition-all duration-300 ease-in hover:bg-primary/90"
                >
                  <span className="text-center">Passer à la caisse</span>
                  <ArrowRightIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
