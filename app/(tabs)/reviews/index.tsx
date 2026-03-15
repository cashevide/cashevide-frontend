import { View, TouchableOpacity } from "react-native";
import { useThemeStore } from "@/src/store/useThemeStore";
import { useColorScheme } from "nativewind";
import { Text } from "@/src/components/ui/Text";

export default function ReviewPage() {
  const { theme, setTheme } = useThemeStore();

  const { colorScheme } = useColorScheme();

  const toggleTheme = () => {
    if (colorScheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-background">

      <Text variant="h1" className="font-sans text-3xl font-bold text-heading mb-4">
        Hello Noufal! 👋
      </Text>

      <Text className=" text-lg text-heading mb-8">
        Current Mode: {colorScheme}
      </Text>
      <TouchableOpacity
        onPress={toggleTheme}
        className="px-6 py-3 bg-primary rounded-xl active:opacity-80"
      >
        <Text className="text-white font-semibold text-base">
          Toggle Theme 🌗
        </Text>
      </TouchableOpacity>

    </View>
  );
}
