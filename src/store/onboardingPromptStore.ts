import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OnboardingPromptState {
  hasSeenMalayaliPrompt: boolean;
  setHasSeenMalayaliPrompt: (hasSeenMalayaliPrompt: boolean) => void;
}

export const useOnboardingPromptStore = create<OnboardingPromptState>()(
  persist(
    (set) => ({
      hasSeenMalayaliPrompt: false,
      setHasSeenMalayaliPrompt: (hasSeenMalayaliPrompt) =>
        set({ hasSeenMalayaliPrompt }),
    }),
    {
      name: "cashevide-onboarding-prompt",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
