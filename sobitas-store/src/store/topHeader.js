import { create } from "zustand";

const useTopHeaderStore = create((set) => ({
  showTopHeader: true,
  toggleShowTopHeader: (topHeader) => set({ showTopHeader: !topHeader }),
}));

export default useTopHeaderStore;
