import { create } from "zustand";
import { encryptData, decryptData } from "@/lib/crypto";

// Create a combined store that can access the information store
const useCartStore = create((set, get) => ({
  cart: [],

  // Initialize cart from encrypted localStorage data
  initializeCart: () => {
    if (typeof window !== "undefined") {
      const encryptedCart = localStorage.getItem("cart");
      if (encryptedCart) {
        try {
          const decryptedCart = decryptData(encryptedCart);
          set({ cart: decryptedCart });
        } catch (error) {
          console.error("Decryption error:", error);
          localStorage.removeItem("cart");
          set({ cart: [] });
        }
      }
    }
  },

  // Helper function to get unique identifier for a product
  getUniqueId: (product) => {
    const variantId = product.selectedVariant
      ? product.selectedVariant.title
      : "";
    return `${product.slug}${variantId ? `-${variantId}` : ""}`;
  },

  // Add product to cart or increase quantity if it exists
  addToCart: (product) =>
    set((state) => {
      // Check if product has necessary properties
      if (!product || !product.slug) {
        console.error("Invalid product data", product);
        return { cart: state.cart };
      }

      // Default quantity to 1 if not specified
      const quantity = product.quantity || 1;

      // Create a unique identifier using product slug and variant (if exists)
      const uniqueId = get().getUniqueId(product);

      const existingProductIndex = state.cart.findIndex((item) => {
        const itemUniqueId = get().getUniqueId(item);
        return itemUniqueId === uniqueId;
      });

      let updatedCart;

      if (existingProductIndex !== -1) {
        // If product with same variant exists, update its quantity
        updatedCart = [...state.cart];
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: updatedCart[existingProductIndex].quantity + quantity,
        };
      } else {
        // Add as new item with default quantity if not provided
        const newProduct = {
          ...product,
          quantity: quantity,
        };
        updatedCart = [...state.cart, newProduct];
      }

      // Save to localStorage
      try {
        localStorage.setItem("cart", encryptData(updatedCart));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }

      return { cart: updatedCart };
    }),

  // Update quantity of a specific product
  updateQuantity: (uniqueId, newQuantity) =>
    set((state) => {
      if (newQuantity <= 0) {
        return get().removeFromCart(uniqueId);
      }

      const updatedCart = state.cart.map((item) => {
        const itemUniqueId = get().getUniqueId(item);
        if (itemUniqueId === uniqueId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      try {
        localStorage.setItem("cart", encryptData(updatedCart));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }

      return { cart: updatedCart };
    }),

  // Decrease the quantity of a product by 1
  decreaseQuantity: (uniqueId) =>
    set((state) => {
      const itemIndex = state.cart.findIndex((item) => {
        const itemUniqueId = get().getUniqueId(item);
        return itemUniqueId === uniqueId;
      });

      if (itemIndex === -1) {
        return { cart: state.cart }; // Item not found
      }

      const currentQuantity = state.cart[itemIndex].quantity;

      if (currentQuantity <= 1) {
        return get().removeFromCart(uniqueId); // Remove if quantity will be 0
      }

      const updatedCart = [...state.cart];
      updatedCart[itemIndex] = {
        ...updatedCart[itemIndex],
        quantity: currentQuantity - 1,
      };

      try {
        localStorage.setItem("cart", encryptData(updatedCart));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }

      return { cart: updatedCart };
    }),

  // Remove a product from cart completely
  removeFromCart: (uniqueId) =>
    set((state) => {
      const updatedCart = state.cart.filter((item) => {
        const itemUniqueId = get().getUniqueId(item);
        return itemUniqueId !== uniqueId;
      });

      try {
        localStorage.setItem("cart", encryptData(updatedCart));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }

      return { cart: updatedCart };
    }),

  // Calculate price with TVA for a single product
  calculatePriceWithTVA: (product, tvaRate) => {
    const basePrice = product.price;
    const priceWithTVA = basePrice + basePrice * tvaRate;
    return priceWithTVA * product.quantity;
  },

  // Helper to calculate total price of items in cart with TVA
  getCartTotalWithTVA: (tvaRate) => {
    const { cart } = get();
    return cart.reduce((total, item) => {
      const itemTotal = get().calculatePriceWithTVA(item, tvaRate);
      return total + itemTotal;
    }, 0);
  },

  // Original helper to calculate total price without TVA
  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  },

  // Helper to get total number of items in cart
  getItemCount: () => {
    const { cart } = get();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  // Clear the entire cart
  clearCart: () => {
    try {
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Error clearing cart from localStorage:", error);
    }
    set({ cart: [] });
  },
}));

export default useCartStore;
