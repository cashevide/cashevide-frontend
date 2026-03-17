import '@/global.css';
import { useRouter, useSegments, Stack, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useState, useEffect } from 'react';
import { useColorScheme } from 'nativewind';
import { useColorScheme as useDeviceColorScheme, View, ActivityIndicator } from 'react-native';
import { useThemeStore } from '@/src/store/useThemeStore';
import { useFonts } from 'expo-font';

import { Logo } from '@/src/components/ui/Logo';
import { Spinner } from '@/src/components/ui/Spinner';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, checkLoginStatus } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  const rootNavigationState = useRootNavigationState();

  const { colorScheme, setColorScheme } = useColorScheme();
  const { theme } = useThemeStore();
  const systemTheme = useDeviceColorScheme();

  const [isReady, setIsReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    'Geist': require('../assets/fonts/Geist-Variable.ttf'),
  });

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await checkLoginStatus();
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsReady(true);
      }
    };

    prepareApp();
  }, []);

  useEffect(() => {
    if (theme === 'system') {
      setColorScheme(systemTheme ?? 'light');
    } else {
      setColorScheme(theme);
    }
  }, [theme, systemTheme]);

  useEffect(() => {
    if (!isReady || !rootNavigationState?.key || (!fontsLoaded && !fontError)) return;

    const inAuthGroup = segments[0] === '(auth)';

    const inDesignGroup = segments[0] === 'design';

    if (!isAuthenticated && !inAuthGroup && !inDesignGroup) {
      router.replace('/(auth)/welcome');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/reviews');
    }

    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 100);

  }, [isAuthenticated, segments, isReady, rootNavigationState?.key, fontsLoaded, fontError]);


  if (!isReady || (!fontsLoaded && !fontError)) {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#010101' }}
        className="dark"
      >
        <Logo width={100} color="#fcfcfe" />
        <Spinner variant="muted" className="mt-6" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} className={colorScheme === 'dark' ? 'dark' : 'light'}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
};
