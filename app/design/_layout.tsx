import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/src/store/useThemeStore';
import { useColorScheme } from 'nativewind';
import { SunIcon, MoonIcon } from 'react-native-heroicons/outline';

function ThemeToggle() {
  const { setTheme } = useThemeStore();
  const { colorScheme } = useColorScheme();

  const toggleTheme = () => {
    setTheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <TouchableOpacity onPress={toggleTheme} className="mr-4 p-2 rounded-full bg-secondary">
      {colorScheme === 'dark' ? (
        <SunIcon color="var(--color-foreground)" size={20} />
      ) : (
        <MoonIcon color="var(--color-foreground)" size={20} />
      )}
    </TouchableOpacity>
  );
}

export default function DesignLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: 'var(--color-background)' },
        headerTintColor: 'var(--color-foreground)',
        headerTitleStyle: { fontFamily: 'Geist', fontWeight: 'bold' },
        headerShadowVisible: false,
        headerRight: () => <ThemeToggle />,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Design System' }} />
      <Stack.Screen name="buttons" options={{ title: 'Buttons' }} />
      <Stack.Screen name="inputs" options={{ title: 'Inputs & Forms' }} />
      <Stack.Screen name="typography" options={{ title: 'Typography' }} />
      <Stack.Screen name="layouts" options={{ title: 'Layout Containers' }} />
    </Stack>
  );
}
