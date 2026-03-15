import { View, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { Text } from "@/src/components/ui/Text";


import { Button } from '../../src/components/ui/Button';

export default function WelcomeScreen() {

  const router = useRouter();
  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <View className="flex-1 w-full max-w-[800px] mx-auto justify-center items-center bg-background">

        <Text variant="h1" className="text-3xl font-bold text-center mb-10 text-gray-800">
          Welcome to Cashevide
        </Text>
        <View className="w-full">

          {/* Google Button */}
          <TouchableOpacity
            className="bg-red-500 p-4 rounded-2xl mb-4 items-center shadow-sm"
            onPress={() => { /* Google Logic */ }}
          >
            <Text className="text-white font-semibold text-lg">Continue with Google</Text>
          </TouchableOpacity>

          {/* Email Button */}
          <TouchableOpacity
            className="bg-blue-600 p-4 rounded-2xl mb-6 items-center shadow-sm"
            onPress={() => router.push('/(auth)/signup-referral')}
          >
            <Text className="text-white font-semibold text-lg">Continue with Email</Text>
          </TouchableOpacity>

        </View>

        {/* Login Footer */}
        <View className="justify-center items-center mt-4">
          <Text className="text-gray-600">Already have an account? </Text>
          <Button
            title="Login"
            variant="ghost"
            className="mt-4"
            onPress={() => router.push('/(auth)/login')}
          />
        </View>

      </View>


    </View>
  )
}
