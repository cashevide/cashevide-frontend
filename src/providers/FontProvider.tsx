import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { View } from "react-native";

// Prevent the splash screen from auto-hiding before we know if the fonts are ready.
// This must run once, at module load time, before the component mounts.
SplashScreen.preventAutoHideAsync();

export function FontProvider({ children }: PropsWithChildren) {
  const [fontsLoaded, fontError] = useFonts({
    Geist_400Regular: require("@/src/shared/assets/fonts/Geist_400Regular.ttf"),
    Geist_500Medium: require("@/src/shared/assets/fonts/Geist_500Medium.ttf"),
    Geist_600SemiBold: require("@/src/shared/assets/fonts/Geist_600SemiBold.ttf"),
    Geist_700Bold: require("@/src/shared/assets/fonts/Geist_700Bold.ttf"),
  });

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      setAppIsReady(true);
    }
  }, [fontsLoaded, fontError]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {children}
    </View>
  );
}
