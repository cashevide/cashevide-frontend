import '@/global.css';
import { useRouter, useSegments, Stack, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useState, useEffect } from 'react';
import { useColorScheme } from 'nativewind';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { useThemeStore } from '@/src/store/useThemeStore';

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
    if (!isReady || !rootNavigationState?.key) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/welcome');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/reviews');
    }

    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 100);

  }, [isAuthenticated, segments, isReady, rootNavigationState?.key]);

  if (!isReady) {
    return null;
  }

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};
