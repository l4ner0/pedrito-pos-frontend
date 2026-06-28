import { create } from "zustand";
import { type BusinessData, type BusinessSettings } from "@/services/businessService";

interface BusinessStore {
  business: BusinessData | null;
  settings: BusinessSettings | null;
  setBusiness: (business: BusinessData) => void;
  setSettings: (settings: BusinessSettings) => void;
  clearBusiness: () => void;
}

export const useBusinessStore = create<BusinessStore>((set) => ({
  business: null,
  settings: null,
  setBusiness: (business) => set({ business }),
  setSettings: (settings) => set({ settings }),
  clearBusiness: () => set({ business: null, settings: null }),
}));
