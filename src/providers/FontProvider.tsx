import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Platform, Text, View } from "react-native";

// Prevent the splash screen from auto-hiding before we know if the fonts are ready.
// This must run once, at module load time, before the component mounts.
SplashScreen.preventAutoHideAsync();

export function FontProvider({ children }: PropsWithChildren) {
  const [fontsRequested, fontError] = useFonts({
    Geist_400Regular: require("@/src/shared/assets/fonts/Geist_400Regular.ttf"),
    Geist_500Medium: require("@/src/shared/assets/fonts/Geist_500Medium.ttf"),
    Geist_600SemiBold: require("@/src/shared/assets/fonts/Geist_600SemiBold.ttf"),
    Geist_700Bold: require("@/src/shared/assets/fonts/Geist_700Bold.ttf"),
  });

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    if (!fontsRequested && !fontError) {
      return;
    }

    if (
      Platform.OS === "web" &&
      typeof document !== "undefined" &&
      document.fonts
    ) {
      document.fonts.ready.then(() => setAppIsReady(true));
      return;
    }

    setAppIsReady(true);
  }, [fontsRequested, fontError]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      // Browsers only fetch/register a @font-face font once something on the
      // page actually renders with it. Render every weight off-screen so
      // they're all requested up front, instead of waiting for the first
      // real usage of each one (which is what was leaving Geist_500Medium
      // stuck in "unloaded" — nothing using it had rendered yet).
      <Text
        style={{
          position: "absolute",
          opacity: 0,
          fontFamily: "Geist_400Regular",
        }}
      >
        <Text style={{ fontFamily: "Geist_500Medium" }}>.</Text>
        <Text style={{ fontFamily: "Geist_600SemiBold" }}>.</Text>
        <Text style={{ fontFamily: "Geist_700Bold" }}>.</Text>
      </Text>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {children}
    </View>
  );
}
