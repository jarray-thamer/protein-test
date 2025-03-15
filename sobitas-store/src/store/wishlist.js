import { create } from "zustand";

const useWishlistStore = create((set) => ({
  wishlistCount: 0, // Keeps track of the number of items in the wishlist
  increaseWishlist: () =>
    set((state) => ({ wishlistCount: state.wishlistCount + 1 })),
  decreaseWishlist: () =>
    set((state) => ({ wishlistCount: state.wishlistCount - 1 })),
  setWishlistCount: (count) => set({ wishlistCount: count }), // Set the count directly
}));

export default useWishlistStore;
