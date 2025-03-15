import { getInformation } from "@/services/information";
import { create } from "zustand";

const useInformationStore = create((set) => ({
  information: {},
  initInformation: async () => {
    const data = await getInformation();
    set({ information: data.data });
  },
}));

export default useInformationStore;
