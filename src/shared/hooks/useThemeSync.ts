import { useEffect } from "react";
import { useColorScheme } from "nativewind";

import { useThemeStore } from "@/src/store/themeStore";

export function useThemeSync() {
  const theme = useThemeStore((state) => state.theme);

  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(theme);
  }, [theme, setColorScheme]);
}
