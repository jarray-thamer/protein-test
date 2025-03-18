import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  actions: {
    setUser: (user) => set({ user }),
    setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
    setIsLoading: (isLoading) => set({ isLoading }),
  },
}));

// Optional selectors for direct access
export const useUser = () => useAuthStore((state) => state.user);
export const useIsLoggedIn = () => useAuthStore((state) => state.isLoggedIn);
export const useIsAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthActions = () => useAuthStore((state) => state.actions);
