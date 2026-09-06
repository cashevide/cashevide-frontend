import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MalayaliModeState {
  isMalayaliMode: boolean;
  setMalayaliMode: (isMalayaliMode: boolean) => void;
}

export const useMalayaliModeStore = create<MalayaliModeState>()(
  persist(
    (set) => ({
      isMalayaliMode: false,
      setMalayaliMode: (isMalayaliMode) => set({ isMalayaliMode }),
    }),
    {
      name: "cashevide-malayali-mode",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
