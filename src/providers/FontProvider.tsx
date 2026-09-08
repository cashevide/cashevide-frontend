import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from "@expo-google-fonts/geist";
import { View } from "react-native";

// Prevent the splash screen from auto-hiding before we know if the fonts are ready.
// This must run once, at module load time, before the component mounts.
SplashScreen.preventAutoHideAsync();

export function FontProvider({ children }: PropsWithChildren) {
  const [fontsLoaded, fontError] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
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
