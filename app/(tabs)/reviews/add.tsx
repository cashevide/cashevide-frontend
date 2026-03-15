
import { View, Text, TouchableOpacity } from "react-native";
import { useThemeStore } from "@/src/store/useThemeStore";
import { useColorScheme } from "nativewind";

export default function AddPage() {
  return (
    <View className="flex-1 items-center justify-center bg-background">

      <Text className="text-3xl font-bold text-text mb-4">
        Hello Noufal! 👋
      </Text>


    </View>
  );
}
